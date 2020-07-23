/* eslint-disable no-useless-escape */

import _ from 'lodash'
import * as regex from './regex'
const isDevMode = true;

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

class Utils {

  static getFirstFailedElem(fieldNames, errors) {
    let firstFailed = '';
    for (var i = fieldNames.length - 1; i >= 0; i--) {
      if(errors[fieldNames[i]]) {
        firstFailed = fieldNames[i];
      }
    }
    return document.querySelector(`[name="${firstFailed}"]`)
  }

  static searchItems(arr, str) {
    const exp = new RegExp(`(?:${str.toUpperCase()})`, 'g');
    const result = arr.filter(e=> Object.keys(e).map(key => String(e[key]).toUpperCase()
        .match(exp)).filter(result=> result).length
    );
    //console.log(result);
    return result;
  }

  static parseBoolean(value) {
    return value === true || value === 'true' || parseInt(value,10) > 0;
  }

  static getFetchQuery (activeField, pageNumber, orderDirection, pageSize) {
    let orderBy = activeField;
    const query = {
      pageNumber,
      orderBy,
      orderDirection
    };
    if (pageSize) {
      query.pageSize = pageSize
    }
    return query;
  }

  static addSearchFiltersToQuery (query, filters) {
    for (var k in filters) {
      if (filters[k] !== "" && filters[k] !== null) {
        query[k] = filters[k];
      }
    }
    return query;
  }

  static getOptionsList (placeholder, array, labelPropName, valuePropName, orderBy, defaultValue) {
    const list = [];

    if(placeholder !== null){
      list.push({
        label: `--${placeholder}--`,
        value: defaultValue || ""
      });
    }
    // order array
    array = orderBy ? _.orderBy(array, orderBy, 'asc') : array;
    // create options
    array.forEach((el) => {
      // ad new option
      list.push({
        label: el[labelPropName],
        value: el[valuePropName]
      })
    });
    return list;
  }

  static getMultiVariateOptionsList (placeholder, objArray, label1PropName, label2PropName, valuePropName) {
    // data comes in already ordered in the back end
    const list = [
      {
        label: `--${placeholder}--`,
        value: ""
      }
    ];
    // create options
    objArray.forEach((el) => {
      // ad new option
      list.push({
        label: el[label1PropName] + ' ' + (el[label2PropName] == null ? '(0)' : '(' + el[label2PropName] + ')'),
        value: el[valuePropName]
      })
    });
    return list;
  }

  static getInputDateFromDateString (str) {
    if (!str || str === "") {
      return "";
    }
    const date = new Date(str).toISOString().substring(0, 10);
    return date;
  }

  static log(msg, obj) {
    if(isDevMode) {
      if(obj) {
        console.log(msg, obj);
      } else {
        console.log(msg)
      }
    }
  }

  static getOnlyNumbers (str) {
    return str.replace(regex.ONLY_NUMBERS,'');
  }

  static normalizePhoneNumber(phone, defaultValue) {
    //if isString, remove all unnecessary characters
    return (phone && _.isString(phone)) ? phone.replace(regex.PHONE_INVALID_CHARACTERS, '') : defaultValue;
  }

  static formatPhoneNumber(phone, defaultValue = 'Invalid phone number') {
    //normalize string and remove all unnecessary characters
    phone = this.normalizePhoneNumber(phone, defaultValue);

    if (phone.length === 10) {
      //format number to (000) 000-0000
      phone = phone.replace(regex.PHONE_PRIMARY_FORMAT, '($1) $2-$3');
    } else if (phone.length === 12) {
      //format number as +1 (000) 000-0000
      phone = phone.replace(regex.PHONE_SECONDARY_FORMAT, '$1 ($2) $3-$4');
    } else if (phone.length === 13) {
      phone = phone.replace(regex.PHONE_SECONDARY_FORMAT, '$1 ($2) $3-$4')
    } else {
      //save as defaultValue if the string does not match previous conditions
      phone = defaultValue;
    }

    return phone;
  }

  static formatPhoneNumberInternational(phone, defaultValue = 'Invalid phone number') {
    //normalize string and remove all unnecessary characters
    phone = this.normalizePhoneNumber(phone, defaultValue);

    if (phone.length === 12) {
      //format number as +1 (000) 000-0000
      phone = phone.replace(regex.PHONE_SECONDARY_FORMAT, '$1 ($2) $3-$4')
    } else {
      //save as defaultValue if the string does not match previous conditions
      phone = defaultValue;
    }

    return phone;
  }

  static formatPhoneNumberUS(phone, defaultValue = 'Invalid phone number') {
    //normalize string and remove all unnecessary characters
    phone = this.normalizePhoneNumber(phone, defaultValue);

    if (phone.length === 10) {
      //format number to (000) 000-0000
      phone = phone.replace(regex.PHONE_PRIMARY_FORMAT, '($1) $2-$3');
    } else {
      //save as defaultValue if the string does not match previous conditions
      phone = defaultValue;
    }
    return phone;
  }


  static isInternationalPhone(phone) {
    phone = this.normalizePhoneNumber(phone, '');
    return phone.length >= 12 && phone.charAt(0) === '+';
  }

  static getFormattedDate (dateStr, removeExactTime) {
    if (dateStr) {
      const parsedDate = new Date(dateStr);
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      const date = parsedDate.getDate();
      const month = months[parsedDate.getMonth()];
      const year = parsedDate.getFullYear();
      const exactTime = `${parsedDate.getUTCHours()}:${parsedDate.getMinutes()}:${parsedDate.getSeconds()}`;
      const formattedDate = removeExactTime ? `${month} ${date}, ${year}` : `${month} ${date}, ${year} @ ${exactTime}`;

      return formattedDate;
    }
  }

  static getFormattedDateSmall(date) {
    if (date) {
      const parsedDate = new Date(date);

      return parsedDate.toISOString().substring(0, 10);
    }
  }

  static isValidNumber(number) {
    return /^-?\d+(\.\d+)?$/.test(number);
  };

  static normalizeNumber (number) {
    const normalizedNumber = number.toString().replace(/,/g, '').replaceAll(' ', '');

    return this.isValidNumber(normalizedNumber) ? parseFloat(normalizedNumber) : 0
  };

  static formatNumberWithCommas (number) {
    let normalizedValue = this.normalizeNumber(number).toString();

    let x = normalizedValue.split('.');
    let x1 = x[0] + '';
    let x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1,$2');
    }

    return x1 + x2;
  }

  static formatCurrency (number) {
    return '$' + this.formatNumberWithCommas(number.toString().replace('$',''));
  }


  static formatNumberWithDecimals (number) {
    let formattedNumber = number.replace(/[^\d\.\-]/g, "");
    formattedNumber = parseFloat(formattedNumber);
    return formattedNumber.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  static formatCurrencyWithDecimals (number) {
    return this.formatNumberWithDecimals(number.toString().replace('$',''));
  }

  static normalizeCurrency (currency) {
    return this.normalizeNumber (currency.replace('$',''));
  }

  static reconstructHTML (str) {
    let
    init = /\&lt;/g,
    end = /\&gt;/g

    str = str.replace(init, '<')
    str = str.replace(end, '>')
    return str
  }

  static sanitizeQuotes(str) {
    let
      sin = /(\')/g,
      dub = /(\")/g,
      d = '\"'

    str = str.replace(sin, d)
    str = str.replace(dub, d)
    return str
  }

  static displayQuotes(str) {
    // ONLY USE FOR UI DISPLAY,
    // NEVER USE FOR DATA DESTINED TO BACKEND, DATABASE, OR S3
    let
      double = /(\")/g,
      single = '\''

    str = str.replace(double, single)
    return str
  }

  static replaceQuotes(str) {
    let
      sin = /(\')/g,
      dub = /(\")/g,
      d = 'APOSTROPHE'

    str = str.replace(sin, d)
    str = str.replace(dub, d)
    return str
  }

  static cleanUrl(str) {
    // Urls should not be fed names with an '&' in them.  Change to 'and'
    let _str = str.replace(/&/g, 'and')
        _str = _str.replace(/(\?|\<|\>|\#|\%|\{|\}|\||\\|\^|\~|\;|\:|\=|\[|\]|\`|\")/g, '')
    return _str
  }

  static sortByPQassociation(list) {

    const dynamicSort = (property) => {
      var sortOrder = 1;

      if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }

      return function (a,b) {
        if(sortOrder === -1){
          return b[property].localeCompare(a[property]);
        }else{
          return a[property].localeCompare(b[property]);
        }
      }
    }

    const checkAssoc = (item) => {
      return item.isAssociated === 1
    }

    const checkUnAssoc = (item) => {
      return item.isAssociated === 0
    }

    let
      assocList   = list.filter(checkAssoc),
      unAssocList = list.filter(checkUnAssoc),
      ordered1    =  assocList.sort(dynamicSort('name')),
      ordered2    =  unAssocList.sort(dynamicSort('name'))

    return [...ordered1,...ordered2]
  }

  static isObjEmpty(obj){
    /* eslint-disable */
    let output = true
    for (let prop in obj) {
      output = false;
    }
    /* eslint-enable */
    return output;
  }

  static boolify(input){
    let output = true
    if (typeof input === 'object' && Array.isArray(input) && input.length === 0) {
      output = false
    } else if (typeof input === 'object' && input != null && typeof input.size === 'undefined' && Utils.isObjEmpty(input)) {
      output = false
    } else if (input === 0 || input === '0' || input === 'false' || input === false || typeof input === 'undefined' || input == null || input === '' || input.size === 0) {
      output = false
    }
    return output
  }

  static checkObjForUndefinedOrNullProps(obj, objectName){
      if (Utils.isObjEmpty(obj)) {
        console.log('This object has no properties')
      } else {
        Object.entries(obj).forEach(
          ([key, value]) => {
            if ((typeof value === 'string') && value.length < 1)  {
              console.log(`${objectName}.${key} is an empty string`)
            } else if (typeof value === 'undefined')  {
              console.log(`${objectName}.${key} is undefined`)
            } else if (value == null) {
              console.log(`${objectName}.${key} is null`)
            } else if ((Array.isArray(value) && value.length < 1)) {
              console.log(`${objectName}.${key} is an empty array`)
            } else if ((typeof value === 'object') && Utils.isObjEmpty(value)) {
              console.log(`${objectName}.${key} is an empty object`)
            }

          }
        )
      }
    return obj
  }

  static objectifyString(str, keys, types){
    let
      obj = {},
      arr = str.split('_')
    for (let i=0; i<keys.length; i++) {
      let val = ''
      if (types[i] === 'obj') {
        val = JSON.parse(arr[i])
      } else if (types[i] === 'num') {
        val = Number(arr[i])
      } else if (types[i] === 'bool') {
        val = Utils.boolify(arr[i])
      } else {
        val = arr[i]
      }
      obj[keys[i]] = val
    }
    return obj
  }

  static returnOnRole(profile, preQual, certFocus) {
    if (_.isEmpty(profile)) {
      if (Array.isArray(preQual)) {
        return [];
      } else {
        return {};
      }
    }

    if (profile.Role && profile.CFRole) {
      if (Array.isArray(preQual)) {
        return [
          ...preQual,
          ...certFocus
        ];
      } else {
        return {
          ...preQual,
          ...certFocus
        };
      }
    } else if (profile.Role) {
      return preQual;
    } else if (profile.CFRole) {
      return certFocus;
    }
  }

  static getUrlParameters (queryParams) {
    return `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
  }
  static getPaginatedUrlParameters (query_params, page_size) {
    let queryParams = {...query_params};
    const pageSize = page_size || 10;
    if (queryParams) {
      if (queryParams.withoutPag || queryParams.withoutPagination) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
      }
      else {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 0;
        }
        if (!queryParams.pageSize) {
          queryParams.pageSize = pageSize;
        }
      }
    }
    else {
      queryParams = {
        pageNumber: 1,
        pageSize
      };
    }
    return this.getUrlParameters(queryParams);
  }

  static removeLeadingAndTrailingSpaces (str) {
    return str.replace(regex.LEADING_TRAILING_SPACES, "");
  }


  static getOptionsListWithAllValues (placeholder, array, labelPropName, valuePropName, orderBy, defaultValue, ...moreFields) {
    const list = [];

    if(placeholder !== null){
      list.push({
        label: `--${placeholder}--`,
        value: defaultValue || ""
      });
    }
    // order array
    array = orderBy ? _.orderBy(array, orderBy, 'asc') : array;
    // create options
    array.forEach((el) => {
      // ad new option
      let obj = {
        label: el[labelPropName],
        value: el[valuePropName],
      }
      moreFields.forEach((f) => obj[f] = el[f]);

      list.push(obj);
    });
    return list;
  }

  static isObjInObjArr = (searchedObj, arr) => {
    for (let i=0; i<arr.length; i++) {
      let obj = arr[i]
      let properties = Object.keys(searchedObj).length
      for (let p in obj) {
        if (obj[p] == searchedObj[p]) {
          properties--
        }
        if (properties == 0) {
          return obj
        }
      }
    }
    return false
  }

  static areObjArraysDifferent = (_arr1, _arr2) => {

    const arr1 = _arr1.sort((a, b) => { return a.value - b.value })
    const arr2 = _arr2.sort((a, b) => { return a.value - b.value })

    if (arr1.length != arr2.length) {
      return true
    } else {
      for (let i=0; i<arr1.length; i++) {
        const obj1 = arr1[i]
        const obj2 = arr2[i]

        for (let p in obj2) {
          if (obj1[p] != obj2[p]) {
            return true
          }
        }
      }
    }

    return false
  }

  static uniqueBy = (arr, prop) => {
    return arr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  static deepValueReplace = (obj, val, newVal) => {
    const regex = new RegExp(val,"gi");
    return _.cloneDeepWith(obj, (value) => {
      //value === val ? newVal : undefined
      if (typeof value === typeof val) {
        return (value.includes(val) || ((typeof value === 'string') && (value.toLowerCase().includes(val.toLowerCase()))))
          ? value.replace(regex, newVal)
          : undefined
      }
    });
  }

  /**
   * Check if the requested function string is present in the provided functions list.
   *
   * @param actionName {string} Descriptive text of the the function
   * @param actionPermissions {Object} Object with the list of allowed functions
   * @param actionPermissions.function {string} Descriptive text of the the function that can be performed
   * @returns {boolean} True if the requested function is in the list, False otherwise
   */
  static canPerformFunction = (actionName, actionPermissions) => {
    if (actionPermissions) {
      return !!(actionPermissions.find( elem => elem.function.toLowerCase() === actionName))
    }
    return false
  }

  static addEmptyListItem = (list, placeholder) => {
    return [
      { label: placeholder || 'Select ...', value: '' },
      ...list,
    ];
  }
}

export default Utils;