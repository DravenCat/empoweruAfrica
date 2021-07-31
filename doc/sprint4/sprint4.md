## Sprint 4 Planning Meeting: 
This meeting is held on July 21, 2021 on Discord. The main purpose of this meeting is to make a clear plan for Sprint 4 and break down tasks into subtasks. All of the team members attended the Sprint 4 Planning Meeting. We selected the rest of the user stories that we wanted to achieve by the end of representation, and broke them down into smaller tasks and assigned tasks to every team member. At last, we decided the dates of every standup.

## Sprint goal:
Finish user stories  UOF -15  UOF - 16  UOF - 22  UOF - 23  UOF - 24    UOF - 26 UOF - 27 UOF - 28 UOF - 123 UOF - 105


## Tasks Breakdown:
## Task: 
Finish the leftover users stories in the previous sprints.
UOF - 105

## Task: 
Integrate front-end and back-end in the E-learning part.
UOF - 123

## Epic: Entrepreneurs can upload their work under a certain module and see the grade of their works.
UOF - 22 UOF-24
Tasks:
- Create endpoint for submission upload & reupload
- Create frontend component for submission upload
- Create database methods for submission upload & reupload


## Epic: Instructors are able to see the works submitted by entrepreneurs and grade their works.
UOF - 23
Tasks:
- Create endpoint to get all submission for a deliverable
- Create endpoint to create a feedback (grade + comment) for a submission
- Create a front-end area where submissions are listed and can be graded.


## Epic: Instructors and entrepreneurs can use a calendar to set important dates.
UOF - 27 UOF -28
Tasks:   
- Create a front-end component showing the calendar.
- Create an endpoint for users to set the key dates.
- Create endpoints to get all key dates related to the user. 
- Create a database to store these key dates that users set.

## Epic: Instructors can set deadlines that would be seen in the entrepreneur's calendar. 
UOF - 26
Tasks:
- Create endpoints for setting key dates for a course. 
- Create a front-end area that instructors can set the deadline.
- Create a database to store the times.

## Epic: Admin has the right to ban a user and remove a post in the community.
UOF - 15  UOF -16
Tasks:
- Create a list of admin accounts in the database.
- Create a button for the admin to ban users or remove posts in the front-end area.


## Spikes: 
For the calendar feature, due to the high complexity of making a calendar from scratch, we initially decided to use google calendar to implement this feature. However, we found that google calendar's API is hard to implement and it requires an account to login in. Instead, we later chose to use FullCalendar.js which is highly integrated with React and easy to use.


## Team capacity:
| Name | Estimated hours of work per day |
| --- | --- |
| Siyang Chen | 5 |
| Jiazheng Li | 2 |
| Dezhi Ren | 4 |
| Yuanqian Fang | 4 |
| Jiayu Lu | 4 |

With a team of 5, our team is able to dedicate 129 hours to this sprint to complete 51 points. 

## Participants: 
Dezhi Ren, Jiayu Lu, Jiazheng Li, Siyang Chen, Yuanqian Fang
