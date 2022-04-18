const timeValueConverter = (function(){

    function convertTotalMinutesToTime(totalMins){
        let standardTime;
        let hour = Math.floor(totalMins/60)
        let meridian
            if(hour > 0 && hour <12){
                meridian = "a"
            }else if(hour == 0){
                hour += 12
                meridian = "a"
            }else if(hour == 12){
                meridian = "p"
            }else{
                hour -=12
                meridian = "p"
            }
            
        let mins = totalMins%60
            if(mins == 0){
                mins = "00"
            }
        standardTime = `${hour}:${mins}${meridian}`
        return standardTime
    }

    function runConvertTotalMinutesToTime(totalMins){
        return convertTotalMinutesToTime(totalMins)
    }

    function convertTimeToTotalMinutes(time){
        const colonIndex = time.indexOf(":");
        const meridian = time[time.length-1]
        const meridianIndex = time.indexOf(meridian);
        
        let hour = Number(time.slice(0, colonIndex));
            if(meridian == "p" && hour != 12){
                hour +=12;
            }else if(meridian == "a" && hour == 12){
                hour -=12;
            }
        const min = Number(time.slice(colonIndex + 1, meridianIndex));
        const totalMinutes = hour*60 + min;

        return totalMinutes
    }

    function runConvertTimeToTotalMinutes(time){
        return convertTimeToTotalMinutes(time)
    }

    return {runConvertTimeToTotalMinutes, runConvertTotalMinutesToTime}
})();

module.exports = timeValueConverter