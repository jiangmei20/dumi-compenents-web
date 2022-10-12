/**
 * @description :导出excel数据
 * @author：蒋梅
 * @email :
 * @creatTime : 2022/01/17
 */
import React, { useState } from 'react';
//@ts-ignore
import ExportJsonExcel from 'js-export-excel';
import { message, Button } from 'antd';
// @ts-ignore
import { saveAs } from 'file-saver';
import { DownloadOutlined } from '@ant-design/icons';

// import { useDispatch,Dispatch } from "umi";
interface ListItem {
  label: string;
  value: string | number;
}

export interface DataMappingItem {
  /** 字段 */
  field: string;
  /** 字段需要映射的列表 */
  list?: ListItem[];
  /** 字段需要映像的方法,不是列表数据时可传处理函数（参数是该字段对应的值）并返回的值 */
  dataMappingMethod?: (values: any, record?: any) => string;
}

interface ExportExcelProps {
  /** 导出文件的名称 */
  fileName: string;
  /** 获取数据的地址，需要分页 */
  url?: string;
  /** 导出的数据，当url不存在的时候需要传数据才能导出 */
  sheetData?: any[];
  /** 表头字段名，需要显示的字段 */
  sheetFilter: string[];
  /** 表头与sheetFilter中字段对应的名称 */
  sheetHeader: string[];
  /** 每一列的宽度，需要与表头一一对应 */
  columnWidths?: number[];
  /**搜索的条件*/
  searchParam?: any;
  /** 导出的总条数 */
  total: number;
  /** 每页多少条数据 */
  pageSize?: number;
  /** 数据映射 */
  dataMapping?: DataMappingItem[];
  /** 异步处理数据的方法 */
  asyncMethod?: (value: any) => Promise<any>;
}

const ExportExcel = (props: ExportExcelProps) => {
  // const dispatch:Dispatch=useDispatch();
  // 当前已经存储的所有数据列表
  let allRecords: any[] = [];
  const {
    fileName,
    url,
    sheetData,
    sheetFilter,
    sheetHeader,
    columnWidths,
    searchParam,
    total,
  } = props || {};
  //是否正在导出
  const [exporting, setExporting] = useState(false);
  //导出进度
  const [exportProgress, setExportProgress] = useState(0);

  /**
   * 获取需要导出的所有数据列表
   */
  const getAllRecords = async () => {
    if (url) {
      const pageSize = props?.pageSize || 1000;
      //  计算页数
      const pageCount = Math.ceil(total / pageSize);
      setExporting(true);
      for (let index = 0; index < pageCount; index++) {
        let size = pageSize;
        if (index === pageCount - 1) {
          size = total % pageSize || pageSize;
        }
        console.log('正在导出第', index, '页', size);

        // const result =
        //   (await dispatch({
        //     type: url,
        //     payload: {
        //       ...searchParam,
        //       size: size,
        //       current: index + 1,
        //     },
        //   })) || [];
        // let newRecords={...result};
        // if(props?.asyncMethod){
        //   newRecords.records = await props?.asyncMethod(result?.records||[]);
        // }
        // newRecords?.records.forEach((item:any) => {
        //   item = getMappingData(item);
        //   allRecords.push(item);
        // });
        setExportProgress(allRecords?.length);
      }
    } else {
      if (sheetData) {
        let needData = sheetData;
        if (props?.asyncMethod) {
          needData = await props?.asyncMethod(needData || []);
        }
        if (props?.dataMapping && sheetData?.length > 0) {
          needData = sheetData.map((item: any) => {
            return getMappingData(item);
          });
        }
        allRecords = needData;
      }
    }
    setExporting(false);
    return allRecords;
  };

  /**
   * 获取映射后返回的数据
   * @param item 每条数据
   */
  const getMappingData = (item: any) => {
    let newItem = { ...item };
    if (props?.dataMapping) {
      props.dataMapping.map((mappingItem: DataMappingItem) => {
        let field = mappingItem.field;
        if (mappingItem?.list) {
          newItem[field] =
            mappingItem.list.find(
              (listItem: ListItem) => listItem.value == item[field],
            )?.label || item[field];
        } else if (mappingItem?.dataMappingMethod) {
          newItem[field] = mappingItem?.dataMappingMethod(item[field], item);
        }
      });
    }
    return newItem;
  };
  /**
   * 导出excel（下载excel）
   * @param sheetSetting 表中需要配置的参数
   * @param getAllRecords 请求数据的方法
   * @param total 总条数
   * @param exportFileName 文件名字
   *
   */
  const downloadExcel = async (
    sheetSetting: any,
    getAllRecords: any,
    total: number,
    exportFileName: string,
  ) => {
    let sheet = [];
    const SHEET_SIZE = 1000000;
    const allRecords = await getAllRecords().catch((e: any) => {
      console.log(e);
      message.warning('导出失败！！');
      setExporting(false);
      return false;
    });
    if (total > SHEET_SIZE) {
      let len = Math.ceil(total / SHEET_SIZE);
      for (let i = 0; i < len; i++) {
        let exportData = allRecords.slice(
          i * SHEET_SIZE,
          i * SHEET_SIZE + SHEET_SIZE,
        );
        sheet.push({ sheetData: exportData, ...sheetSetting });
      }
    } else {
      sheet = [{ sheetData: allRecords || [], ...sheetSetting }];
    }
    const option = {
      fileName: exportFileName,
      saveAsBlob: true,
      datas: sheet,
    };
    const excelFile = new ExportJsonExcel(option).saveExcel();
    saveAs(excelFile, `${exportFileName}.xlsx`);
  };

  /**
   * 点击导出
   */
  const onExport = () => {
    let sheetSetting = {
      columnWidths,
      sheetFilter: sheetFilter,
      sheetHeader: sheetHeader,
      rowHeight: 30,
    };
    downloadExcel(sheetSetting, getAllRecords, total, fileName).catch(() => {
      setExporting(false);
      message.warning('导出失败！！').then();
    });
    allRecords = [];
    setExportProgress(0);
  };

  return (
    <Button
      loading={exporting}
      onClick={onExport}
      type="primary"
      icon={<DownloadOutlined />}
      disabled={!total}
    >
      {exporting ? `${exportProgress}/${total}` : '导出'}
    </Button>
  );
};
export default ExportExcel;
