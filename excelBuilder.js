const ExcelJS = require('exceljs');
const timeConverterExpress = require('./timeConverterExpress')

const excelBuilder = (function(){

   
    const rowObj = {};
    const columnObj = {};

    function setRowValues(facilityData){
        let i = 2;
        for(let time = facilityData.facilityOpen; time < facilityData.facilityClose; time +=15){
            rowObj[time] = {
                label: timeConverterExpress.runConvertTotalMinutesToTime(time), 
                rowVal: i
            }
            i++
        }
    }

    function pairColumnNameToColumnNumber(number){
        const alphaArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        const indexAdjustedNumber = number -1
        const wholeValue = Math.floor(indexAdjustedNumber/26);
        const remainder = indexAdjustedNumber % 26;
        if(indexAdjustedNumber>=26){
            return `${alphaArray[wholeValue-1]}${alphaArray[remainder]}`
        }else{
            return `${alphaArray[remainder]}`
        }
    }

    function setColumnValues(facilityData){
        for(let i = 0; i < facilityData.days.length; i++){
            const day = facilityData.days[i];
            columnObj[day] = {};
            if(day == "Sun"){
                columnObj[day].startColNum = 2;
                columnObj[day].startColVal = pairColumnNameToColumnNumber(2)
            }else{
                columnObj[day].startColNum = columnObj[facilityData.days[i-1]].endColNum + 1;
                columnObj[day].startColVal = pairColumnNameToColumnNumber(columnObj[day].startColNum)
            }
            columnObj[day].endColNum = columnObj[day].startColNum + 5;
            columnObj[day].endColVal = pairColumnNameToColumnNumber(columnObj[day].endColNum)
        }
    }

    function setDayLabels(worksheet){
        for(let day in columnObj){
            const startCell = worksheet.getCell(`${columnObj[day].startColVal}1`);
            const endCell = worksheet.getCell(`${columnObj[day].endColVal}1`);
            
            worksheet.mergeCells(`${startCell._address}:${endCell._address}`)

            const startColumn = columnObj[day].startColVal
            const endColumn = columnObj[day].endColVal

            for(let i = 1; i<58; i++){
                const leftCell = worksheet.getCell(`${startColumn}${i}`)
                const rightCell = worksheet.getCell(`${endColumn}${i}`)

                leftCell.border = {left: {style:'thick'}}
                rightCell.border = {right: {style:'thick'}}

                if(i == 57){
                    rightCell.border = {right: {style:'thick'}, bottom: {style: 'thick'}}
                }
            }

            startCell.value = `${day}`;
            startCell.alignment = {vertical: "middle", horizontal: "center", wrapText: true}
            startCell.font = { name: 'Calibri', size: 11, bold: true }
        }
    }

    function setTimeLabels(worksheet){
        for(let time in rowObj){
            const cell = worksheet.getCell(`A${rowObj[time].rowVal}`);
            cell.value = rowObj[time].label
        }
        const columnBorderArray = [1, 7, 13, 19, 25, 31, 37, 43]
        for(let i = 1; i<44; i++){
            const columnVal = pairColumnNameToColumnNumber(i)
            const cell = worksheet.getCell(`${columnVal}57`);
            cell.border = {bottom: {style:'thick'}}
            if(columnBorderArray.indexOf(i)!= -1){
                cell.border = {bottom: {style:'thick'}, right: {style:'thick'}}
            }
        }
        
        
    }

    function sortTeamsBySize(schedule){
        const newArray = schedule.slice();
        newArray.sort(function(a,b){
            return b.size - a.size
        })
        return newArray
    }

    function setTeams(teamArray, worksheet){
        teamArray.forEach(function(team){ //this needs to be done BEFORE IT GETS HERE, OTHERWISE IT REDUCES TEAM SIZE PROGRESSIVELY FOR EACH NEW SCHEDULE, do in controller
            team.validDays.forEach(function(trainingDay){
                console.log(trainingDay)
                let i = 0;
                if(trainingDay.inWeiss == "yes"){
                    while(i < 6-team.size){ //? right end point?
                        const verification = verifyColumnUnoccupied(worksheet, team, trainingDay, i);
                        if(verification == undefined){
                            setCurrentDay(worksheet,team, trainingDay, i);
                            break;
                        }else if(6-i == team.size -1 ){
                            throw('Formatting error! Teams do not fit in appropriate spaces')
                        }else{
                            i++
                        }
                    }
                }
            })
            console.log("------------------ TEAM BREAKPOINT --------------------------------")

        })
    }

    function verifyColumnUnoccupied(worksheet, team, trainingDay, i){
        try{
            const currentColumn = columnObj[trainingDay.dayOfWeek].startColNum + i;
            const ineligibleColumn = columnObj[trainingDay.dayOfWeek].endColNum + 1;
            const teamSizeColumnEnd = team.size -1

            if(currentColumn + teamSizeColumnEnd == ineligibleColumn){
                throw("Column alignment error in scheduling valid time and team")
            }else{
                const column = pairColumnNameToColumnNumber(currentColumn);
                for(let time = trainingDay.startTime; time < trainingDay.endTime; time +=15){
                    const row = rowObj[time].rowVal;
                    const cell = worksheet.getCell(`${column}${row}`);
                    if(cell.value != null){
                        throw("Team exists in this column")
                    }
                }
            }
        }catch(conflict){
            if(conflict == "Team exists in this column"){
                return conflict
            }else{
                throw(conflict)
            }
        }
    }

    function setCurrentDay(worksheet, team, trainingDay, i){
        const startColumnNum = columnObj[trainingDay.dayOfWeek].startColNum + i;
        const startColumn = pairColumnNameToColumnNumber(startColumnNum)
        const endColumn = pairColumnNameToColumnNumber(startColumnNum + team.size - 1);
        const startRow = rowObj[trainingDay.startTime].rowVal;
        const endRow = rowObj[trainingDay.endTime].rowVal;

        const startCell = worksheet.getCell(`${startColumn}${startRow}`);
        const endCell = worksheet.getCell(`${endColumn}${endRow}`)

        worksheet.mergeCells(`${startCell._address}:${endCell._address}`)

        startCell.value = team.name +"\n" + timeConverterExpress.runConvertTotalMinutesToTime(trainingDay.startTime) +" :\n" + timeConverterExpress.runConvertTotalMinutesToTime(trainingDay.endTime);
        startCell.alignment = {vertical: "middle", horizontal: "center", wrapText: true};
        startCell.fill = {type: "pattern", pattern: "solid", fgColor: {argb: team.color}};
        startCell.border = {top: {style:'medium'}, left: {style:'medium'}, bottom: {style:'medium'}, right: {style:'medium'}}
        startCell.font = { name: 'Calibri', size: 11 }
    }

    function setConflicts(worksheet, conflicts){
        let i = 0
        for(let team in conflicts){
            const adjustedTeamRowNumber = i+1; //1
            const labelCell = worksheet.getCell(`A${adjustedTeamRowNumber}`);
            labelCell.value = team;
            let j = 1
            for(let day in conflicts[team]){ //2, 6
                const dayLabelCell = worksheet.getCell(`B${adjustedTeamRowNumber+j}`);
                dayLabelCell.value = day
                let k = 1
                for(let time in conflicts[team][day]){ //3,4,5 ; 7,8
                    const timeLabelCell = worksheet.getCell(`C${adjustedTeamRowNumber+j+k}`);
                    timeLabelCell.value = timeConverterExpress.runConvertTotalMinutesToTime(time);
                    let l=0;
                    conflicts[team][day][time].forEach(function(conflict){
                        conflict.forEach(function(subConflict){
                            const alphaArray = ["D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
                            const cell = worksheet.getCell(`${alphaArray[l]}${adjustedTeamRowNumber+j+k}`);
                            subConflict.time = timeConverterExpress.runConvertTotalMinutesToTime(time);
                            cell.value = subConflict
                            l++
                        })
                        
                    })
                    k++
                }            
                j += k
            }
            i = j
        }
    }

    function buildExcelSchedules(scheduleData, facilityData){ // create if condition in controller that tests if completedSchedules.length exists, then passes appropriate parameter (cS or lS, if lS then return errorList somehow too?)
        const workbook = new ExcelJS.Workbook();
        setRowValues(facilityData);
        setColumnValues(facilityData)
        
        if(scheduleData.completedSchedules){
            scheduleData.completedSchedules.forEach(function(schedule){
                const schedIndex = scheduleData.completedSchedules.indexOf(schedule);
                const worksheet = workbook.addWorksheet(`Sheet ${schedIndex +1}`);
                worksheet.views = [{state: 'frozen', xSplit: 1, ySplit: 1}]
                const sizeSortedTeams = sortTeamsBySize(schedule) 
            
                setDayLabels(worksheet);
                setTimeLabels(worksheet);
                setTeams(sizeSortedTeams, worksheet)
            })
        }else{
            const schedule = scheduleData.longestStack;
            const worksheet1 = workbook.addWorksheet(`Sheet 1`);
            worksheet1.views = [{state: 'frozen', xSplit: 1, ySplit: 1}]
            const sizeSortedTeams = sortTeamsBySize(schedule) 
        
            setDayLabels(worksheet1);
            setTimeLabels(worksheet1);
            setTeams(sizeSortedTeams, worksheet1)

            const worksheet2 = workbook.addWorksheet("Sheet 2");
            setConflicts(worksheet2, scheduleData.conflicts)

        }
       
        return workbook
    }

    return {buildExcelSchedules}

})()

module.exports = {buildExcelSchedules: excelBuilder.buildExcelSchedules}