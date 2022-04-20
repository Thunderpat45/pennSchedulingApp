# Facility Scheduling App
## Description
### Overview

This is a project is a web application designed to help resolve scheduling issues in facilities that need a repeating weekly pattern, but experience conflicts between time and space/volume.

https://dolan-scheduling-app-04192022.herokuapp.com/
### Contributions

Submitting bug issues is greatly appreciated. At this point, there will not likely be substantial updates to this project aside from addressing operational issues that are identified.

### Premise

My motivation for this was a recurring issue in my own workplace, in which we have many teams who need to build out a stable, 
weekly schedule but compete for space and time within our limited size facility. Each 'coach/teamLeader' has a number of teams, 
but cannot host multiple teams at once, and must respect the overall capacity of our single facility. 
The previous method to address this issue was simply to try to 'eye up' the best solution on which teams should be scheduled when, 
which inevitably led to conflicts that caused this scheduling process to take weeks. As it was, the process was not only time-inefficient, 
it also rarely came up with the optimized solution, and most teams had to generate unexpected back-up requests that were far from optimal.

I wanted to come up with a solution that could not only generate a solution faster, but would actually test out all options and find the choices that
truly represented, as close as possible, the time requests that our teams submitted, and so I created this web application as an attempt to address this. 

## Operation

### General

<ul>
  <li>Various profiles are available for direct login, but a user-only and an admin profile are both available for testing.</li>
  <li>Admins are capable of executing admin options, as well as having user actions for their own teams as well</li>
  <li>User data and overall facility settings are independent of 'season', while availability and team data dependent on the season in which they are created</li>
  <li>All profiles act on a shared database to pool data together for a single schedule. For the purposes of preventing accidental sabotage of a future tester's experience, a cron-task refreshes the database to base values on the 0 and 30 mins of every hour</li>
</ul>

### User Actions

Users are 'coaches' who are responsible for individual teams within the facility. Each user can:
<ul>
  <li>create/edit/delete teams:</li>
     <ul>
       <li>team name</li>
       <li>team size (number of athletes)</li>
       <li>list of requests, each with a subset of the days, times, and locations of requested training sessions for that request</li>
       <li>team verification date, notifying admins of the last time the team's requests were confirmed as up-to-date</li>
     </ul>
  <li>create/edit/delete availability restrictions:</li>
    <ul> 
      <li>start/endTime</li>
    </ul>
  <li>modify team order display (for preference only)</li>
  <li>verify all current teams for this user are up-to-date</li>
</ul>

 *Teams/availabilities are seasonally dependent. Creating/editing/deleting a team/availability does not affect a similar one for the opposing season. Each functions independently on the assumption that the schedule for fall/spring is not necessarily paired.*


*Any restrictions to availability (meetings/other obligations not explicit in other teams' request times) should be filled out. The scheduling algorithm will test times +/- 30mins from requested startTime for teams where the requested startTime of a day is not compatible with the current stack of allTeams requests.*

### Admin Actions

Admins have all the functionalities of general users, and additionally can:
<ul>
  <li>Add/modify/delete users:</li>
    <ul>
      <li>user name</li>
      <li>user password (NEW USERS ONLY)</li>
      <li>user admin role</li>
      <li>user schedule color</li>
    </ul>
  <li>create/edit/delete admin availability restrictions:</li>
   <ul> 
     <li>start/endTime</li>
   </ul>
  <li>adjust the facility settings that dictate the hours and max capacity of the facility at any given time</li>
  <li>remove or add teams from consideration in the current scheduling algorithm iteration, based on incompatibility or requests that are not up-to-date</li>
  <li>modify the order of teams (sets priority of scheduling algorithm: teams higher on the list are more likely to retain their first request in case of conflicts)   </li>
  <li>run the scheduling algorithm to generate a spreadsheet</li>
</ul>

*Users can only be generated by admin actions. There is no method to create your own profile.*

*Admin availabilities are seasonally dependent, and add a restriction to ALL users, which cannot be removed from user profiles except by admin action. Creating/editing/deleting an admin availability does not affect a similar one for the opposing season. Each functions independently on the assumption that the schedule for fall/spring is not necessarily paired.*

*User colors are not displaying properly via the ExcelJS library.* **See known issues**

## Known Bugs and Improvement Ideas

### Server-Side

<ul>
   <li>Bug: The xlsx file fill color for each coach is conditionally successful depending on what program opens the file (Excel/LibreCalc/GoogleSheets). Programs that cannot successfully render color output cells with unreadable black fill and black text. A <a href = 'https://github.com/exceljs/exceljs/issues/2029'>bug report</a> has been submitted to the ExcelJS source library. Until this issue is resolved, the file will currently output without color.
  </li>
  
  <li>Improvement: When running algorithm, current practice is that if one team is completely incompatible, capture the stack of teams up to that point and generate schedule to include those teams, then report the 'blocking' team. This will not assess if teams further in the stack might also have been blocking, as the algorithm currently will not reach them. Recommendation to catch the conflict, then 'drop' the offending team to continue generating the schedule. This will have a more complete schedule output, and capture all teams with full conflicts in a single process, instead of waiting to fix the conflict with one team to then find another.</li>
  
</ul>


### Client-Side
<ul>
  <li>Improvement: The application is not currently optimized for mobile and is not particularly responsively design. This was largely based on the assumption that since xlsx usage is not innately simple on most mobile devices, it would be simpler to try to restrict to PC usage. However, the CSS restrictions are not accurate, and are not limiting mobile users as intended. Recommendation to either improve mobile experience and notify of xlsx issues, or fully restrict mobile usage as initially intended</li>
  <li>Improvement: Most modals that have more functionality than selecting just drop downs, like 'Modify Team Order' for admins, and team creation/edits for teams with multiple requests, rerender content after button clicks. This has limited effect on small modals, but large modals 'reset' the view to the top of the modal scroll bar, which can be frustrating when dealing with a large team or with the large team order list. Recommendation to adjust render somehow to maintain scroll position on re-render(?)</li>
  <li>Bug: Triggering click events on buttons outside a modal while a modal is active can have breaking behavior. Recommendation to blur/darken background and remove scroll/click functionality on background while a modal is active</li>
  <li>Bug: For user-based team creation, the save action is disabled until all drop-downs have a non-default value && team name is not empty. The function that assesses if drop-downs have non-default values is buggy, and sometimes accurately enables the save button on the last drop-down value being selected, but other times requires changes on one or more already set drop-downs to then enable the save button. </li>
</ul>

## Implementation Details

The project uses vanilla Javascript on the front-end, as well as Node.js on the back-end, with an Express server, MongoDB/Mongoose database/ORM, and ExcelJS spreadsheet builder. The techs used were selected as an off-shoot of my progress through the Odin Project, as I am at the time of writing this working towards a full-stack development career change. 

As I was building this project while I was learning most of these concepts for the first time, one major change I would have made is the implementation of a front-end framework from nearer to the start. A frameworked (React/Angular) front-end would have likely made this project much more simple, but by the time I realized how much work the vanilla version of the front-end was, I had already put a substantial amount of time into creating an MVC with a PubSub controller, and did not want to interfere with that. Alongside of this, throughout most of the project I was unaware of unit testing, and so implementation of unit testing from the start (Jasmine/Jest) would have also simplified the process as well. 

## Final Notes

This is my first full-stack project, and I'd love feedback/suggestions for changes or future best practices. 

Thanks to the Odin Project, which I am still undertaking as of this writing, for providing a rewarding curriculum that builds self-efficacy through web-development. The Library project helped me square away my inspiration for this project, and the lessons along the Node.js path helped me to understand my way (or at least some of the way) through to the end. 

I'd also like to show appreciation to the computer science students here who indulged me in my excited ramblings, and provided valuable insights into both project design and concepts worth exploring for this application and beyond.

Anyone who would like to explore working with me, please don't hesitate to reach out!
