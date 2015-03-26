Introduction to the export-coverity-defects script
==================================================

Dependencies
------------

```
npm install jsonfile
```

Usage
-----

Modify the `export.js` script firstly, there are two variables need to be configed: **`CONFIG_PROJECTID`** and **`CONFIG_SESSIONID`**.

```
./export.js table.json exported-data.csv
```

There is a `JSON` file you need to prepared before executed. You can save it from the API: https://scan4.coverity.com/reports/table.json?projectId=<PROJECT_ID>&viewId=<VIEW_ID>

This API is called when you visit **View Defects** page or change the page number. Open the developer tools, and you won't miss this!

*WARNING:* This is an unofficial script that may fail some day, if there's any change to the coverity.com API.
