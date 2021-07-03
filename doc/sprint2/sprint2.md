## Sprint 2 Planning Meeting: 
This meeting is held on June 21, 2021 on Discord. The main purpose of this meeting is to make a clear plan for Sprint 2 and break down tasks to subtasks. All of the team members attended the Sprint 2 Planning Meeting. In the meeting, we first determined that we will show the project demo on 2th July. After that, we decided the dates of every standup. At last, we selected the user stories that we want to achieve by the end of Sprint 2, and broke them down into smaller tasks and assigned tasks to every team member.


## Sprint goal:
Finish user stories UOF-7, UOF-8, UOF-9, UOF-10, UOF-11, UOF-12, UOF-13,  UOF-14,  UOF-15,  UOF-16, (and additional ones carried over)


## Tasks Breakdown:

### Epic: Different types of users have their own profile and users are all able to modify their information in the profile page.
UOF-7, UOF-8, UOF-9
Tasks:
- Build three types of profile pages (Both editor’s view and viewer’s view) for three types of users.
- Setup MySQL tables to store the information in the profile.
- Write code for dealing with the request of updating the information. 
- Write functions in db.js to query the MySQL databases.


### Epic: Users can make a post, reply to a post, follow a post and delete posts made by themselves in the community.
UOF-10, UOF-11, UOF-12, UOF-13,  UOF-14
Tasks:
- Build the community page
- Build the post component
- Write handlers in the backend to handle create post, delete post, reply to post, follow post, view posts, view comments requests.
- Write functions in db-init.js to provide a neo4j database connection. (DO THIS FIRST)
- Write functions in db.js to query the Neo4j database.


### Epic: Admin has the right to delete some bad posts and ban some users.
UOF-15,  UOF-16
Tasks:
- Have a file that holds a list of usernames of admins
- Build the community page with the admin view(there are choices to manage posts and users)


## Spikes:
When building the profile page, we wrote each tag as a html element and this caused the code to be very messy and hard to read. The data fetched from the server also became difficult to inject into the tag element. We finally decided to make each tag as a react component, so that the context of tags can be passed as props and we do not need to duplicate the code when adding more tags.


## Team capacity:
| Name | Estimated hours of work per day |
| --- | --- |
| Siyang Chen | 5 |
| Jiazheng Li | 2 |
| Dezhi Ren | 4 |
| Yuanqian Fang | 4 |
| Jiayu Lu | 4 |


Participants: 
Dezhi Ren, Jiayu Lu, Jiazheng Li, Siyang Chen, Yuanqian Fang
