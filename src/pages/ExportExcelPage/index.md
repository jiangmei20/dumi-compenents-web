---
nav:
title: 导出组件
path: /pages/ExportExcelPage
---

## 导出组件

Demo:

```tsx
import React from "react";
import ExportExcel from "../../components/ExportExcel";
export default ()=>{
// data数据
  let dataTable = [
    {
      Test1: 'hello',
      Test2: 'tim',
      name: '小米',
      status: 1,
    },
    {
      Test1: 'hello2',
      Test2: 'tim',
      name: '小米',
      status: 2,
    },
  ];
  let arr = [
    {
      field: 'status',
      list: [
        { label: '完成', value: 1 },
        { label: '未完成', value: 2 },
      ],
    },
  ];
  let option = {
    fileName: '导出',
    sheetName: 'sheet',
    sheetFilter: ['name', 'Test1', 'status'], //需要显示的字段
    sheetHeader: ['名称', '表头2', '状态'], //表头与sheetFilter中字段对应的名称
    sheetData: dataTable,
    searchParam: {},
    total: 1,
    dataMapping: arr,
  };
  return <ExportExcel {...option} />;
}
```
