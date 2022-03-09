# SpacebookApp

Introduction:

The submission for the Mobile Applications Development coursework assignment can be found in this repository. The 'node modules' directory has been ignored by Git through the '.gitignore' file, as per best practises. A 'camelCase' structure was used to write all of the code. The 'SpacebookApplication' directory contains all of the files for the Android application. The version of npm used to develop this project is '8.0.0'. The Android application was developed and tested on a Pixel 2 (Play Store enabled) emulator running Android 7.0 (API 24). The recording for this submission will be contained within this repo, however, will not be uploaded to GitHub.

Things I learned through building this project:

1.	General UI / UX as I had to consider how well the app responded to different usecases e.g., errors from the backend

2.	Building a React Native app from scratch, using functional components & hooks (my course taught React Native using classbased components, however I already knew functional, so it made sense to me to use this instead).

Link to GitHub repo for submission:

https://github.com/Haider133/SpacebookApplication for submission purposes only)

Code Quality:

I am using AirBNB style guide:

I enforced this through using ESLint and prettier, which automatically detected any issues and forced me to fix these throughout the project. https://github.com/airbnb/javascript

Spacebook Endpoints:

All of the below endpoints have been fully implemented, including appropriate response/error handling.

User Management:

1.	POST /user – Signup

2.	POST /login - Login

3.	POST /logout - Logout

4.	GET /user/{user_id} - View User Information

5.	PATCH /user/{user_id} - Update Information

6.	GET/user/{user_id}/photo- View User profile photo

7.	POST/user/{user_id}/photo- Update User profile photo

Friend Management:

1.	GET/user/{user_id}/friends- View list of friends for given user

2.	POST/user/{user_id}/friends- Add new friend

3.	GET/friendrequests- View list of pending friends requests

4.	POST/friendrequests/{user_id}- Accept a friend request

5.	DELETE/friendrequests/{user_id}- Reject a friend request

6.	GET/search- Find friends

Post Management:

1.	GET /user/{user_id}/post - Get list of posts for a given user

2.	POST/user/{user_id}/post- Add a new post

3.	GET /user/{user_id}/post/{post_id}- View a single post

4.	Delete/ user/{user_id}/post/{post_id}- Delete a post

5.	PATCH/ user/{user_id}/post/{post_id}- Update a post

6.	POST/ user/{user_id}/post/{post_id}/like- Like a post

7.	DELETE/ user/{user_id}/post/{post_id}/like- Remove a like from a post

App Features:

List of features implemented:

1.	Ability to create/register an account, login and logout.

2.	Ability to view & edit the user's account details based of the saved values in the DB. e.g. Change First Name, Last Name & Email.

3.	Ability to view and permissions to edit the user’s profile photo

4.	Ability to view friends and add/delete a friend request.

5.	Ability to view/add/delete/update a post, like/unlike a post.

6.	Ability to view a user profile information by clicking either on the profile picture from search friends list or from post section.

7.	Application automatically bypasses the sign-in requirement if you have already signed in.

8.	Splashy animation and animated loaders being used. Website being used to create splash animation https://lottiefiles.com/

9.	A separate helper class(API/Index.js) being used for all async calls.

10. A Separate styles/common class being used for all stylesheets.

 Extension task 1:

1.	Ability to save local drafts of posts before sending them to the API.

2.	Ability to view, edit ,post and delete drafts.

Extension task 2:

1.	Ability to schedule the date and time when a draft is posted.

2.	Ability to perform the schedule at the background automatically(when the user is not on the app).

App Screenshots:

Here are a few screenshots taken from the completed application:



How to Run:

1.	Clone the repo, run 'npm install' to install the dependencies.

2.	Create your .env file with your DB config details.

3.	Run the server with 'npm start'.

4.	Go into the SpacebookApp directory & run 'npm install' to install the required dependencies.

5.	To run the application use 'npx react-native run-android'.

6.	Application should compile, install, and launch.

 PSA: You need an account to use or signup within the application to create an account in seconds.

Enjoy!

Future:

1.	Fully iOS support

2.	In profile section user able to see the friend list along all their posts.

3.	Revamp the UI
