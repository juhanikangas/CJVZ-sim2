export const filterByInput = (input, dataList, valuesToSearch) => {
    //console.log("filterbyinput: " + input);
    if (input && dataList && valuesToSearch) {
      const results = dataList.filter((user) => {
        let userData = "";
        valuesToSearch.map((value) => {
          userData += (!user[value] || user[value] == null
            ? ""
            : user[value] + " "
          ).toLowerCase();
        });
        //console.log(userData);
        return userData.indexOf(input.toLowerCase()) !== -1 ? user : "";
      });
      return results;
    } else {
      return dataList;
    }
  };
  
  export const filterByAllValues = (input, dataList) => {
    if (input && dataList) {
      const results = dataList.filter((user) => {
        let string = "";
        Object.values(user).forEach((item) => {
          if (item != null) string += item.toString().toLowerCase();
        });
        return string.includes(input.toLowerCase());
      });
      return results;
    } else {
      return dataList;
    }
  };
  