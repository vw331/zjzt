const local = window.localStorage;

export const Local = {
  get(key) {
      if (key) return JSON.parse(local.getItem(key))
      return null
  },
  set(key, val) {
      const setting = arguments[0]
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
          for (const i in setting) {
            local.setItem(i, JSON.stringify(setting[i]))
          }
      } else {
        local.setItem(key, JSON.stringify(val))
      }
  },
  remove(key) {
    local.removeItem(key)
  },
  clear() {
    local.clear()
  }
}

export const Cookie = {
  get (key) {
      //console.log("document cookie="+document.cookie);
      let arr = document.cookie.split('; ')
      for (let i = 0; i < arr.length; i++) {
          let arr2 = arr[i].trim().split('=');
          if (arr2[0] == key) {
              return arr2[1]
          }
      }
      return ''
  },
  set (key, value, day) {
      let setting = arguments[0]
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
          for (let i in setting) {
              let oDate = new Date()
              oDate.setDate(oDate.getDate() + day)
              document.cookie = i + '=' + setting[i] + ';expires=' + oDate
          }
      } else {
          let oDate = new Date()
          oDate.setDate(oDate.getDate() + day)
          document.cookie = key + '=' + value + ';expires=' + oDate
      }
  },
  remove (key) {
      let setting = arguments[0]
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Array') {
          setting.forEach( key => {
              this.set(key, 1, -1)
          })
      }else{
          this.set(key, 1, -1)
      }
      
  }
}