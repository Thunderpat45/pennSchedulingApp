const ExcelJS = require('exceljs'); //node files

const excelBuilder = (function(){

    const workbook = new ExcelJS.Workbook();

    const rowObj = {};
    const columnObj = {};
    const colorObj = {}; //use this or set it to each team on creation?
    const adminOptions = {} //must be able to get this from DB

    //completeSchedules and adminOptions and usersObj need to be accessible here as of right now

    /*
    function setColorObjToCoachColors(//usersObj){
        usersObj.forEach(function(user){
            colorObj[user] = user.color
        })
    }
    */

    function pairTimeRangesToRows(adminOptions){ //adminOptions.timeRange
        let i = 2;
        for(let time = adminOptions.timeRange.start; time < adminOptions.timeRange.end; time +=15){
            rowObj[time] = {
                label: convertMinutesToTotalTime(time), //this function needs to be available here
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

    function pairDayRangesToColumns(adminOptions){ //adminOptions.dayRange, adminOptions.slots
        for(let i = 0; i < adminOptions.dayRange.length; i++){
            const day = adminOptions.dayRange[i];
            columnObj[day] = {};
            if(day == "Sun"){
                columnObj[day].startColNum = 2;
                columnObj[day].startColVal = pairColumnNameToColumnNumber(2)
            }else{
                columnObj[day].startColNum = columnObj[adminOptions.dayRange[i-1]].endColNum + 1;
                columnObj[day].startColVal = pairColumnNameToColumnNumber(columnObj[day].startColNum)
            }
            columnObj[day].endColNum = columnObj[day].startColNum + adminOptions.slots -1;
            columnObj[day].startColVal = pairColumnNameToColumnNumber(columnObj[day].endColNum)
        }
    }

    function setDayLabels(worksheet){
        for(let time in rowObj){
            const cell = worksheet.getCell(`A${time.rowVal}`);
            cell.value = time.label
        }
    }

    function setTimeLabels(worksheet){
        for(let day in columnObj){
            const startCell = worksheet.getCell(`${day.startColVal}1`);
            const endCell = worksheet.getCell(`${day.endColVal}1`);
            startCell.value = `${day}`;
            worksheet.mergeCells(`${startCell}:${endCell}`)
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
            team.validDays.forEach(function(day){
                let i = 0;
                if(day.inWeiss == "yes"){
                    if(verifyColumnUnoccupied(worksheet, team, day, i) == "Team exists in this column"){
                        verifyColumnUnoccupied(worksheet, team, day, ++i)
                    }else{
                        setCurrentDay(worksheet, team, day, i)
                    }
                }
            })
        })
    }

    function verifyColumnUnoccupied(worksheet, team, day, i){
        try{
            const currentColumn = columnObj[day.dayOfWeek].startColNum + i;
            const ineligibleColumn = columnObj[day.dayOfWeek].endColNum + 1;
            const teamSizeColumnEnd = team.size -1

            if(currentColumn + teamSizeColumnEnd == ineligibleColumn){
                throw("Column alignment error in scheduling valid time and team")
            }else{
                const column = pairColumnNameToColumnNumber(currentColumn);
                for(let time = day.startTime; time < day.endTime; day +=15){
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

    function setCurrentDay(worksheet, team, day, i){
        const startColumnNum = columnObj[day.dayOfWeek].startColNum + i;
        const startColumn = pairColumnNameToColumnNumber(startColumnNum)
        const endColumn = pairColumnNameToColumnNumber(startColumnNum + team.size - 1);
        const startRow = rowObj[day.startTime].rowVal;
        const endRow = rowObj[day.endTime].rowVal;

        const startCell = worksheet.getCell(`${startColumn}${startRow}`);
        const endCell = worksheet.getCell(`${endColumn}${endRow}`)

        startCell.value = team.name //more?
        startCell.alignment = {vertical: "middle", horizontal: "center", wrapText: true};
        startCell.fill = {type: "pattern", pattern: "solid", fgColor: {argb: colorObj[team.coach]}} //change color source

        worksheet.mergeCells(`${startCell}:${endCell}`)

    }

    function buildExcelSchedules(completeSchedules){
        completeSchedules.forEach(function(schedule){
            const schedIndex = completeSchedules.indexOf(schedule);
            const worksheet = workbook.addWorksheet(`Sheet ${schedIndex +1}`);
            const sizeSortedTeams = sortTeamsBySize(schedule)

            setDayLabels(worksheet);
            setTimeLabels(worksheet);
            setTeams(sizeSortedTeams, worksheet)
        })
    }

})()