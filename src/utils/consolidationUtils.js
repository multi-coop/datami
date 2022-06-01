import { findFromPath } from '@/utils/globalUtils.js'

export async function getConsolidationApiUrl (consolidationData, sourceFields) {
  let consolidation
  const errors = []

  console.log('\nU > consolidationUtils > getConsolidationApiUrl > consolidationData : ', consolidationData)
  console.log('U > consolidationUtils > getConsolidationApiUrl > sourceFields : ', sourceFields)
  let apiUrl = consolidationData.api.api
  sourceFields.forEach(sf => {
    apiUrl = apiUrl.replace(`{{${sf.name}}}`, sf.value)
  })
  console.log('U > consolidationUtils > getConsolidationApiUrl > apiUrl : ', apiUrl)

  const req = await fetch(apiUrl)
  console.log('U > consolidationUtils > getConsolidationApiUrl > req : ', req)
  const resp = await req.json()
  console.log('U > consolidationUtils > getConsolidationApiUrl > resp : ', resp)

  if (!req.ok) {
    const err = {
      function: 'getConsolidationApiUrl',
      code: req.status,
      message: resp.message
    }
    errors.push(err)
  } else {
    const resultsMapping = consolidationData.api.results_fields
    consolidation = resultsMapping.map(m => {
      console.log('U > consolidationUtils > getConsolidationApiUrl > m : ', m)
      return {
        fromField: m.resp_field,
        toField: m.map_to_field,
        m: m,
        sourceFields: sourceFields,
        // toFieldId: sourceFields.find(f => f.name === m.map_to_field).id,
        value: findFromPath(m.resp_field, resp)
      }
    })
  }

  // return consolidation data
  return {
    // data: resp,
    consolidation: req.ok && consolidation,
    errors: errors
  }
}
