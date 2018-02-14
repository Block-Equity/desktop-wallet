/* eslint-disable */
//Reference: https://codeburst.io/how-to-store-user-data-in-electron-3ba6bf66bc1e
//Reference: https://blog.risingstack.com/mastering-the-nodejs-core-modules-file-system-fs-module/
//Reference: https://www.eduonix.com/blog/web-programming-tutorials/learn-handle-system-files-node-js/
const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {

  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    const pathName = this.path;
    var data;

    checkIfFile(pathName, function(err, isFile) {
      if (isFile) {
        data = parseDataFile(pathName, opts.defaults);
      } else {
        data = createFile(pathName, opts.defaults);
      }
    });

    this.data = data;
  }

  get fileExists() {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    const pathName = path.join(userDataPath, 'horizon-user-preferences' + '.json');
    var fileExists;
    /*checkIfFile(pathName, function(err, isFile) {
      return isFile;
    });
    return true;*/

    fs.stat(pathName, function fsStat(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          fileExists = false;
        } else {
          fileExists = false;
        }
      }
      fileExists = stats.isFile();
    });

    return fileExists;
  }
  
  get(key) {
    return this.data[key];
  }

  set(key, val, success, failure) {
    this.data[key] = val;
    fs.writeFile(this.path, JSON.stringify(this.data), (err) => {
        if (err) {
            failure(err);
            return console.log(err);
        } else {
            success()
        }
    });
  }

}

function checkIfFile(file, cb) {
  fs.stat(file, function fsStat(err, stats) {
    if (err) {
      if (err.code === 'ENOENT') {
        return cb(null, false);
      } else {
        return cb(err);
      }
    }
    return cb(null, stats.isFile());
  });
}

function createFile(filePath, content) {
  var contentString = JSON.stringify(content);
  fs.writeFile(filePath, contentString, (err) => {
    if (err) {
      return console.error(err);
    }
    return JSON.parse(contentString);
    console.log(`File ${filePath} was successfully saved`);
  });
}

function parseDataFile(filePath, defaults) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
        return console.error(err);
    }
    return JSON.parse(data);
  });
}

module.exports = Store;