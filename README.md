##########################################
DOCUMENTATION 
##########################################

Website:	Canvas | CreateJs
Author: 	Adam Lawrence
Contact: 	me@adamlawrence.com.au

------------------------------------------
DIRECTORY STRUCTURE 
------------------------------------------
- ROOT 	- All pages 

- assets - contains all generic assets for pages
		- fonts - contains icon fonts for graphics 
				- Other fonts on the page are supplied by google
		- img 	- Where all images can be found for the project
		- svg 	- contains advancedyou logos

- lib 	- Where all production and working javascript files can be found contains 
		- GRUNT - Gruntfile.js
				- package.json
		- SASS
		- prod - All production files for the project
				- project.js
				- project.min.js
				- popUp.css
				- screen.css
				- screen_ie.css
		- src 	- Contains all Javascript and sass 	
				- js
					- all working javascript
				- sass 
					- all working scss files

-------------------------------------------------------------
JAVASCRIPT
-------------------------------------------------------------

ALL JAVASCRIPT PAGES USE A PSEUDO-CLASSICAL PATTERN WITH EACH PAGE CONSITING OF 
A CONTRUCTOR FUNCTION WITH ALL METHODS PROTOTYPED FROM THIS.

MORE INFO ON PSEUDO-CLASSICAL PATTERN
http://javascript.info/tutorial/pseudo-classical-pattern#pseudo-class-declaration

All javascript files can be found in 	ROOT\lib\src\js\
	
Then they are compiled using grunt and outputted to ROOT\lib\prod

Some pages contain functions that are mean't to be reused a number of times such as analytics, 
build-links and page-style while other pages are specific to certain pages eg groups_page.aspx | groups-page.js

-------------------------------------------------------------
CSS
-------------------------------------------------------------

ALL SASS FILES CAN BE FOUND IN THE WORKING SECTION OF THE DIR ROOT\lib\src\sass\
THESE FILES COMPILED USING GRUNT OR SASS AND MOVED TO THE PRODUCTION FOLDER 

