---
nav:
title: API
path: /components/DownloadExcel
---

## API
| 参数             | 说明           | 类型                           | 是否必传 | 默认值 | 版本  |
|:---------------|:-------------|:-----------------------------|------|:---|:----|
| fileName       | 导出文件的名称      | string                       | 必传   | 导出 |     |
| url            | 获取数据的地址，需要分页 | string                       |      |     |     |
| sheetData      | 导出的数据，当url不存在的时候需要传数据才能导出 | any[]                        |      |     |     |
| sheetFilter    | 表头字段名，需要显示的字段 | string[]                     | 必传   |     |     |
| sheetHeader    | 表头与sheetFilter中字段对应的名称 | string[]                     | 必传   |     |     |
| columnWidths   | 每一列的宽度，需要与表头一一对应 | number[]                     |      |     |     |
| searchParam    | 搜索的条件 | any                          |      |     |     |
| total          | 导出的总条数 | number                       | 0    |   必传  |     |
| pageSize       | 每页多少条数据 | number                       | 1000 |     |     |
| dataMapping    | 数据映射 | DataMappingItem[]            |      |     |     |
| asyncMethod    | 异步处理数据的方法 | (value: any) => Promise<any> |      |     |     |
 
## API 中 dataMapping 的 DataMappingItem
| 参数    | 说明  | 类型                                         | 是否必传       | 默认值 | 版本  |
|:------|:----|:-------------------------------------------|------------|:---|:----|
| field | 字段  | string                                     | 必传         |  |     |
| list  | 字段需要映射的列表  | {label: string; value: string 或 number;}[] |  |    |  |     |
| dataMappingMethod  | 字段需要映像的方法,不是列表数据时可传处理函数（参数是该字段对应的值）并返回的值  | (values: any, record?: any) => string; |  |    |  |     |




