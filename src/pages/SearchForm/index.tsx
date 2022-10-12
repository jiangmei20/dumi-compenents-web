/**
 * @description :表单使用
 * @author：jm
 * @email :
 * @creatTime : 2022/1/17
 */
import React from 'react';
import { Radio, Checkbox, Button } from 'antd';
import styles from './imdex.less';
import FormContent from '../../components/FormContent';
const SearchForm = () => {
  const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-1',
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
        },
      ],
    },
    {
      title: 'Node2',
      value: '0-1',
    },
  ];
  const fromItem: any[] = [
    {
      label: '组织',
      name: 'nodeId',
      type: 'treeSelect',
      treeData: treeData,
      attribute: {
        // style: { width: '150px' },
      },
    },
    {
      label: '姓名',
      name: 'name',
      type: 'input',
      rules: [{ required: true, message: '请输入姓名' }],
    },
    {
      label: '时间',
      name: 'date',
      type: 'datePicker',
      attribute: {
        format: 'YYYY-MM-DD HH:mm',
        showTime: true,
      },
    },
    {
      label: '时间范围',
      name: 'dateRange',
      type: 'dateRangePicker',
      attribute: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
    },
    {
      label: '报警等级',
      name: 'level',
      type: 'select',
      attribute: {
        style: { width: '150px' },
        required: true,
        onChange: (v: any) => onChange(v),
      },
      options: [
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
      ],
    },
    {
      label: '单选择',
      name: 'radio',
      type: 'customRender',
      render: () => (
        <Radio.Group>
          <Radio value="a">item 1</Radio>
          <Radio value="b">item 2</Radio>
          <Radio value="c">item 3</Radio>
        </Radio.Group>
      ),
    },
    {
      label: '多选选择',
      name: 'checkbox',
      type: 'customRender',
      render: () => (
        <Checkbox.Group>
          <Checkbox value="a">item 1</Checkbox>
          <Checkbox value="b">item 2</Checkbox>
          <Checkbox value="c">item 3</Checkbox>
        </Checkbox.Group>
      ),
    },
  ];

  //添加的按钮
  const addButton = <Button type={'primary'}>导出</Button>;

  /**
   * select监听数据变化
   * @param v
   */
  const onChange = (v: any) => {
    console.log('监听下拉框数据变化', v);
  };

  /**
   * 点击提交
   * @param values
   */
  const onFinish = (values: any) => {
    console.log('表单的值', values);
  };
  return (
    <div className={styles.searchForm}>
      <div
        className={styles.searchFormCon}
        style={{ border: '1px solid #3399cc' }}
      >
        <h1>搜索的用法</h1>
        <FormContent
          formList={fromItem}
          onFinish={onFinish}
          formData={{
            level: 1,
            name: '小孩',
            date: '2021-03-03 11:30',
            dateRange: {
              startTime: '2021-03-03 11:30',
              endTime: '2021-03-04 11:30',
            },
          }}
          formLayout={'inline'}
          customColumn={8}
          addButton={addButton}
        />
      </div>

      <div style={{ border: '1px solid #3399cc', marginTop: '15px' }}>
        <h1>增加的表单用法</h1>
        <FormContent
          formList={fromItem}
          onFinish={onFinish}
          formLayout={'horizontal'}
          customColumn={12}
          finishTitle={'提交'}
          isReset={true}
        />
      </div>
    </div>
  );
};
export default SearchForm;
