import {events} from "../src/events"

const databasePost = (function(){

    events.subscribe("userUpdateRequested", updateUserData);
    events.subscribe("newUserAdditionRequested", addUserData);
    events.subscribe("deleteUserRequested", deleteUserData);
    events.subscribe('adminBlockUpdateRequested', updateAdminBlockData);
    events.subscribe('newAdminBlockAdditionRequested', addAdminBlockData)
    events.subscribe('adminBlockDeleteRequested', deleteAdminBlockData);
    events.subscribe('availabilityBlockUpdateRequested', updateUserBlockData);
    events.subscribe('newAvailabilityBlockAdditionRequested', addUserBlockData)
    events.subscribe('availabilityBlockDeleteRequested', deleteUserBlockData);
    events.subscribe('teamUpdateRequested', updateTeamData);
    events.subscribe('newTeamAdditionRequested', addTeamData)
    events.subscribe('teamDataDeleteRequested', deleteTeamData)
    events.subscribe('teamVerificationUpdateRequested', updateTeamVerificationData);
    events.subscribe('userAllTeamsVerificationUpdateRequested', updateUserVerificationData);
    events.subscribe("adminFacilityDataUpdateRequested", updateFacilityData);
    events.subscribe('teamEnabledUpdateRequested', updateTeamEnabledStatus)

    events.subscribe('myTeamsOrderDataUpdateRequested', updateMyTeamsOrder)
    events.subscribe('allTeamsOrderDataUpdateRequested', updateAllTeamsOrder);

    events.subscribe('scheduleBuildRequested', buildSchedule)
    //events.subscribe('loginAttemptRequested', postLoginAttempt)
   

    async function updateFacilityData(databaseBoundObject){ 
        try{
            await fetch('adminHome/facilitySettings', {
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });
            events.publish("facilityDataSaved")
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
       
    }

    async function updateUserData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const userDataResponse = await fetch(`adminHome/user/${_id}`, { //change the hard-coded id's into userspecific id's SOON
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(userDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(userDataResponse.status == 400){
                const errors = await userDataResponse.json();
                const origin = "edit"
                events.publish("userDataValidationFailed", {errors, origin})
            }else if(userDataResponse.status == 200){ 
                events.publish("editUserDataSaved")
            }
           
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
    }

    async function addUserData(databaseBoundObject){
        try{
            const userDataResponse = await fetch('adminHome/user', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(userDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(userDataResponse.status == 400){
                const errors = await userDataResponse.json()
                const origin = "add"
                events.publish("userDataValidationFailed", {errors, origin})
            }else if(userDataResponse.status == 200){
                const newUser = await userDataResponse.json();  
                events.publish("newUserDataSaved", newUser)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function deleteUserData(userId){
        const idObj = {_id: userId}
        try{
            const userDataResponse = await fetch(`adminHome/user/${userId}`, { //change the hard-coded id's into userspecific id's SOON
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(idObj)
    
            });

            if(userDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(userDataResponse.status == 400){
                const errors = await userDataResponse.json();
                alert(errors);
            }else if(userDataResponse.status == 200){
                events.publish("userDataDeleted", userId)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateAdminBlockData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const blockDataResponse = await fetch(`adminHome/timeBlock/${_id}`, { //change the path
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json();
                const origin = "edit"
                events.publish("adminAvailabilityDataValidationFailed", {errors, origin})
            }else if(blockDataResponse.status == 200){ 
                events.publish("editAdminBlockDataSaved") //find receiver
            }
           
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
    }

    async function addAdminBlockData(databaseBoundObject){
        try{
            const blockDataResponse = await fetch('adminHome/timeBlock', {  //get rid of hard coded season as soon as possible
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json()
                const origin = "add"
                events.publish("adminAvailabilityDataValidationFailed", {errors, origin})
            }else if(blockDataResponse.status == 200){
                const newAdminBlock = await blockDataResponse.json(); 
                events.publish("newAdminBlockDataSaved", newAdminBlock) //find listener
            }
        }catch(err){
            console.log(err)
        }
    }

    async function deleteAdminBlockData(blockData){
        const idObj = {_id: blockData._id}
        try{
            const blockDataResponse = await fetch(`adminHome/timeBlock/${blockData._id}`, { //change the hard-coded id's into userspecific id's SOON
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(idObj)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json();
                alert(errors);
            }else if(blockDataResponse.status == 200){
                events.publish("adminBlockDataDeleted", blockData)
            }
        }catch(err){
            console.log(err)
        }
    }

    ///
    async function updateUserBlockData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const blockDataResponse = await fetch(`home/timeBlock/${_id}`, { //change the path
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
               
                const errors = await blockDataResponse.json();
                const origin = "edit"
                events.publish("userAvailabilityValidationFailed", {errors, origin})
            }else if(blockDataResponse.status == 200){ 
                events.publish("editAvailabilityBlockDataSaved") 
            }
           
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
    }

    async function addUserBlockData(databaseBoundObject){
        try{
            const blockDataResponse = await fetch('home/timeBlock', { 
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json()
                const origin = "add"
                events.publish("userAvailabilityValidationFailed", {errors, origin})
            }else if(blockDataResponse.status == 200){
                const newAdminBlock = await blockDataResponse.json(); 
                events.publish("newAvailabilityBlockDataSaved", newAdminBlock)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function deleteUserBlockData(blockData){
        try{
            const blockDataResponse = await fetch(`home/timeBlock/${blockData._id}`, { //change the hard-coded id's into userspecific id's SOON
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(blockData)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json();
                alert(errors);
            }else if(blockDataResponse.status == 200){
                events.publish("availabilityBlockDataDeleted", blockData)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateTeamData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const teamDataResponse = await fetch(`home/team/${_id}`, { //change the hard-coded id's into userspecific id's SOON
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                const errors = await teamDataResponse.json();
                const origin = "edit"
                events.publish("teamDataValidationFailed", {errors, origin})
            }else if(teamDataResponse.status == 200){ 
                events.publish("editTeamDataSaved")
            }
           
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
    }

    async function addTeamData(databaseBoundObject){
        try{
            const teamDataResponse = await fetch('home/team', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                const errors = await teamDataResponse.json()
                const origin = "add"
                events.publish("teamDataValidationFailed", {errors, origin})
            }else if(teamDataResponse.status == 200){
                const newTeam = await teamDataResponse.json();  
                events.publish("newTeamDataSaved", newTeam)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function deleteTeamData(teamId){
        const idObj = {_id: teamId}
        try{
            const teamDataResponse = await fetch(`home/team/${teamId}`, { //change the hard-coded id's into userspecific id's SOON
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(idObj)
    
            });

            if(teamDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                const errors = await teamDataResponse.json();
                alert(errors);
            }else if(teamDataResponse.status == 200){
                events.publish("teamDataDeleted", teamId)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateTeamVerificationData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const teamDataResponse = await fetch(`home/team/${_id}/verification`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                events.publish("teamVerificationSaved", databaseBoundObject)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateUserVerificationData(timeData){
        const timeDataObj = {lastVerified: timeData}
        try{
            const teamDataResponse = await fetch(`home/allTeamsVerification`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(timeDataObj)
    
            });

            if(teamDataResponse.status == 404){
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                events.publish("allTeamsVerificationSaved", timeData)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateMyTeamsOrder(databaseBoundObject){
        try{
            const teamDataResponse = await fetch(`home/allTeamsOrder`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                events.publish("myTeamsOrderChangeSaved")
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateAllTeamsOrder(databaseBoundObject){
        try{
            const teamDataResponse = await fetch(`adminHome/allTeamsOrder`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                events.publish("allTeamsOrderChangeSaved")
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateTeamEnabledStatus(_id){
        const idObj = {_id}
        try{
            const teamDataResponse = await fetch(`adminHome/team/${_id}/enabledStatus`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(idObj)
    
            });

            if(teamDataResponse.status == 404){
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                events.publish("teamEnableStatusChangeSaved")
            }
        }catch(err){
            console.log(err)
        }
    }

    async function buildSchedule(){
        try{
            const scheduleResponse = await fetch(`adminHome/schedule`, {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json'
          
                },
            });

            if(scheduleResponse.status == 404){
                throw('404 error!')
            }else if(scheduleResponse.status == 400){
                throw('400 error!')
            }else if(scheduleResponse.status == 200){  
                const data = scheduleResponse.json()
                console.log(data)
            }
        }catch(err){
            console.log(err)
        }
    }

    // async function postLoginAttempt(databaseBoundObject){
    //     try{
    //         const logInAttemptResponse = await fetch(`/logIn`, {
    //             method:'POST',
    //             headers:{
    //                 'Content-Type': 'application/json'
          
    //             },
    //             body: JSON.stringify(databaseBoundObject)
    
    //         });

    //         if(logInAttemptResponse.status == 404){ //check these
    //             throw('404 error!')
    //         }else if(logInAttemptResponse.status == 400){
    //             throw('400 error!')
    //         }else if(logInAttemptResponse.status == 401){
    //             const errorMessage = await logInAttemptResponse.json();
    //             const errorArray = [errorMessage]
    //             events.publish('renderLoginPageRequested', errorArray)
    //         }
    //     }catch(err){
    //         console.log(err)
    //     }
    // }

})();

export {databasePost}