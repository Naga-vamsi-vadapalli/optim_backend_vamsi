const filesystem = {
    root: {
      dir1: {
        subdir1: {
          file1: 100,
          file2: 200,
          subsubdir1: {
            file3: 50,
            file4: 150,
            subsubsubdir1: {
              file5: 500,
              emptydir1: {}
            }
          }
        },
        subdir2: {
          file6: 300,
          subsubdir2: {
            file7: 700,
            subsubsubdir2: {
              file8: 800,
              file9: 900
            }
          },
          emptydir2: {}
        },
        file10: 1000
      },
      dir2: {
        subdir3: {
          subsubdir3: {
            file11: 400,
            file12: 500
          },
          subsubdir4: {
            emptydir3: {}
          }
        },
        subdir4: {
          file13: 600,
          subsubdir5: {
            file14: 700,
            file15: 800,
            subsubsubdir3: {
              emptydir4: {},
              file16: 900,
              file17: 1000
            }
          }
        },
        emptydir5: {}
      },
      dir3: {
        file18: 1100,
        subdir5: {
          subsubdir6: {
            file19: 1200,
            subsubsubdir4: {
              file20: 1300,
              emptydir6: {}
            }
          }
        }
      },
      emptydir7: {},
      file21: 1400
    }
  };
  
  function getTotalSize(path, filesystem) {
    const keys = path.split('.'); 
    let dir = filesystem;
  
    for (let key of keys) {
      if (dir[key] === undefined) {
        return `Directory not found: ${path}`;
      }
      dir = dir[key];
    }
  
    function calculateSize(directory) {
      let totalSize = 0;
      for (let key in directory) {
        if (typeof directory[key] === 'number') {
          totalSize += directory[key];
        } else if (typeof directory[key] === 'object') {
          totalSize += calculateSize(directory[key]);
        }
      }
      return totalSize;
    }
  
    return `Total size: ${calculateSize(dir)}`;
  }
  
  console.log(getTotalSize("root.dir1.subdir1", filesystem));  
  console.log(getTotalSize("root.dir2.subdir4.subsubdir5", filesystem));  
  console.log(getTotalSize("root.dir3", filesystem));  
  console.log(getTotalSize("root.nonexistentdir", filesystem));  