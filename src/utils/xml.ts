import * as xml2json from 'xml2json'

function removeXmlDeclaration(fileContent: string) {
  return fileContent.replace(/<\?xml.*>/, '')
}

function addXmlDeclaration(fileContent: string) {
  return '<?xml version="1.0" encoding="utf-8"?>\n' + fileContent
}

export function parseXml(fileContent: string): any {
  return xml2json.toJson(
    removeXmlDeclaration(fileContent),
    { object: true },
  )
}

export function stringifyXml(obj: any): string {
  return addXmlDeclaration(xml2json.toXml(obj))
}
