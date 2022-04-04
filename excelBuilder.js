const ExcelJS = require('exceljs');
const timeConverterExpress = require('./timeConverterExpress')

const excelBuilder = (function(){

    const workbook = new ExcelJS.Workbook();
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
            startCell.value = `${day}`;
            worksheet.mergeCells(`${startCell._address}:${endCell._address}`)
        }
    }

    function setTimeLabels(worksheet){
        for(let time in rowObj){
            const cell = worksheet.getCell(`A${rowObj[time].rowVal}`);
            cell.value = rowObj[time].label
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
        teamArray.forEach(function(team){
            if(team.size == 150){
                team.size = 6
            }else{
                team.size = Math.ceil(team.size/25)
            }
            team.validDays.forEach(function(trainingDay){
                let i = 0;
                if(trainingDay.inWeiss == "yes"){
                    while(i < team.size -1){ //? right end point?
                        const verification = verifyColumnUnoccupied(worksheet, team, trainingDay, i);
                        if(verification == undefined){
                            setCurrentDay(worksheet,team, trainingDay, i);
                            break;
                        }else if(i == team.size -2 ){ //right end point?
                            throw('Formatting error! Teams do not fit in appropriate spaces')
                        }else{
                            i++
                        }
                    }
                }
            })
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

        startCell.value = `${team.name} ${timeConverterExpress.runConvertTotalMinutesToTime(trainingDay.startTime)} : ${timeConverterExpress.runConvertTotalMinutesToTime(trainingDay.endTime)}` 
        startCell.alignment = {vertical: "middle", horizontal: "center", wrapText: true};
        startCell.fill = {type: "pattern", pattern: "solid", fgColor: {argb: team.coach.color}} //change color source

        worksheet.mergeCells(`${startCell._address}:${endCell._address}`)

    }

    function buildExcelSchedules(scheduleData, facilityData){
        setRowValues(facilityData);
        setColumnValues(facilityData)
        scheduleData.completedSchedules.forEach(function(schedule){
            const schedIndex = scheduleData.completedSchedules.indexOf(schedule);
            const worksheet = workbook.addWorksheet(`Sheet ${schedIndex +1}`);
            const sizeSortedTeams = sortTeamsBySize(schedule) 

            setDayLabels(worksheet);
            setTimeLabels(worksheet);
            setTeams(sizeSortedTeams, worksheet)
        })

        return workbook
    }

    return {buildExcelSchedules}

})()

module.exports = {buildExcelSchedules: excelBuilder.buildExcelSchedules}