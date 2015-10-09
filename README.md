# scripter
Web app for building parameterized scripts 

#### Running
```
npm install
bower install
gulp serve
```

#### Scripting

```
Include variable
#{var:variable}

Include Script with id
#{script:1}
```

#### Examples:
```
SELECT * FROM #{tableName}

//Extending previous (assume its id = 1)
#{script:1} WHERE #{tableName}.id = 5;

```
