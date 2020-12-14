export function hasPermission(val = "", permission) {
    return (
      val
        .split("|")
        .findIndex(item => (item ? item.startsWith(permission) : false)) != -1
    );
}

export function val(obj, fields) {
    return fields.split('.').reduce((acc, field) => {
      return acc ? acc[field] : null
    }, obj)
}

export function sval(obj, fields, value) {
    let listFields = fields.split('.')
    let lastField = listFields.pop()
    let parent = listFields.reduce((acc, field, i) => {
      let rs = acc[field]
      if (!rs) {
        rs = {}
        acc[field] = rs
      }
      return rs
    }, obj)
    if (parent) {
      parent[lastField] = value
    }
}

export function flattenObject(dataModel, value, convertAttrName = (name) => name) {
    let tmp = dataModel.reduce((acc, item) => {
      acc[convertAttrName(item.attr)] = val(value, item.attr)
      return acc
    }, {})
    return tmp
}

export function revertObject(dataModel, value, convertAttrName = (name) => name, revertAttrName = (name) => name) {
    let tmp = dataModel.reduce((acc, item) => {
      sval(acc, revertAttrName(item.attr), value[convertAttrName(item.attr)])
      return acc
    }, {})
    return tmp
}