import { findFromPath } from '@/utils/globalUtils.js'

export async function getConsolidationApiUrl (consolidationData, fields, sourceFields) {
  let consolidation
  const errors = []

  // console.log('\nU > consolidationUtils > getConsolidationApiUrl > consolidationData : ', consolidationData)
  // console.log('U > consolidationUtils > getConsolidationApiUrl > fields : ', fields)
  // console.log('U > consolidationUtils > getConsolidationApiUrl > sourceFields : ', sourceFields)
  let apiUrl = consolidationData.api.api
  sourceFields.forEach(sf => {
    const valueStr = encodeURI(sf.value)
    // console.log('U > consolidationUtils > getConsolidationApiUrl > sf : ', sf)
    // console.log('U > consolidationUtils > getConsolidationApiUrl > valueStr : ', valueStr)
    apiUrl = apiUrl.replace(`{{${sf.name}}}`, valueStr)
  })
  // console.log('U > consolidationUtils > getConsolidationApiUrl > apiUrl : ', apiUrl)

  const resp = await fetch(apiUrl)
  // console.log('U > consolidationUtils > getConsolidationApiUrl > resp : ', resp)
  const respData = await resp.json()
  // console.log('U > consolidationUtils > getConsolidationApiUrl > respData : ', respData)

  if (!resp.ok) {
    const err = {
      function: 'getConsolidationApiUrl',
      code: resp.status,
      message: resp.message || resp.statusText
    }

    errors.push(err)
  } else {
    const resultsMapping = consolidationData.api.results_fields
    consolidation = resultsMapping.map(m => {
      // console.log('U > consolidationUtils > getConsolidationApiUrl > m : ', m)
      let targetField = fields.find(f => f.name === m.map_to_field)
      targetField = targetField && {
        field: targetField.field,
        name: targetField.name,
        type: targetField.type,
        subtype: targetField.subtype
      }
      return {
        fromField: m.resp_field,
        toField: targetField,
        newValue: findFromPath(m.resp_field, respData)
      }
    })
  }

  // return consolidation data
  return {
    // data: respData,
    consolidation: resp.ok && consolidation,
    errors: errors
  }
}
