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
    if (fs.existsSync(path)) {
      // Do something
      this.data = parseDataFile(this.path, opts.defaults);
    }
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

function parseDataFile(filePath, defaults) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
        return console.error(err);
    }
    return JSON.parse(data);
  });

}

module.exports = Store;