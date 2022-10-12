/**
 * @description :表单组件(优化后第一版)
 * @author：jm
 * @email :
 * @creatTime : 2022/2/9
 */
import React, { createElement, ReactNode, useEffect } from 'react';
import {
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  TreeSelect,
  Row,
  Col,
  Cascader,
  Space,
  InputNumber,
} from 'antd';
import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;

interface OptionItem {
  label: string;
  value: string | number;
  className?: string;
  disabled?: boolean;
}

interface TreeNode {
  title: ReactNode;
  value: string;
  children?: TreeNode[];
}

interface FormItem {
  name: string;
  label: string;
  /** 显示框的类型，如：input、select、treeSelect、datePicker、dateRangePicker、cascade(级联)、customRender(自定义渲染)等 */
  type:
    | 'input'
    | 'inputNumber'
    | 'select'
    | 'treeSelect'
    | 'datePicker'
    | 'dateRangePicker'
    | 'cascade'
    | 'customRender';
  /** 验证规则，与antd中的写法一样 */
  rules?: any;
  /** 属性（antd中对应显示框的类型有的属性） */
  attribute?: any;
  /** select中的列表数据 */
  options?: OptionItem[];
  /** treeSelect中树节点的数据 */
  treeData?: TreeNode[];
  callback?: () => void;
  /** 当type='customRender' 时，render必填（自己需要渲染的内容） */
  render?: () => ReactNode;
  /**antd中form.item的属性*/
  formItemAttribute?: any;
}

interface Props {
  /** 需要表单字段内容列表 */
  formList: FormItem[];
  /** 初始化内容或者表单回写的内容 */
  formData?: any;
  /** 存储数据 */
  setEditFormData?: any;
  /** 返回数据的方法 */
  onFinish: <A>(values: A) => void;
  /** 表单的布局，值为inline时是搜索 */
  formLayout?: 'horizontal' | 'vertical' | 'inline';
  /** 自定义一排放几个，并且布局不为 inline 的情况下渲染栅格布局 */
  customColumn?: number;
  /** 添加其他按钮 */
  addButton?: ReactNode;
  /** 不显示默认按钮 */
  noShowDefaultBtn?: boolean;
  /** 是否是查看 */
  isDetails?: boolean;
  /** 是否显示重置按钮 */
  isReset?: boolean;
  /** 增加的按钮 */
  onAdd?: () => void;
  /** antd中的form属性 */
  formAttribute?: any;
  /** antd中row的属性 */
  rowAttribute?: any;
  /** antd中row下的col的属性 */
  colAttribute?: any;
  /** 完成的按钮文字节点 */
  finishTitle?: ReactNode;
}

const { Option } = Select;

const FormContent = (props: Props) => {
  const { formList, formLayout = 'horizontal', customColumn } = props;
  const [form] = Form.useForm();
  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 16 },
        }
      : null;
  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: { offset: 4, span: 16 },
        }
      : null;

  const components = {
    select: ({ label, attribute = {}, options = [] }: FormItem) =>
      createElement(
        Select,
        {
          placeholder: `请选择${label}`,
          dropdownClassName: styles.dropdownSelect,
          disabled: props?.isDetails,
          ...attribute,
        },
        options.map((item: OptionItem) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        )),
      ),
    input: ({ label, attribute = {} }: FormItem) => (
      <Input
        placeholder={`请输入${label}`}
        disabled={props?.isDetails}
        {...attribute}
      />
    ),
    inputNumber: ({ label, attribute = {} }: FormItem) => (
      <InputNumber
        placeholder={`请输入${label}`}
        disabled={props?.isDetails}
        {...attribute}
      />
    ),
    treeSelect: ({ label, treeData = [], attribute = {} }: any) =>
      createElement(TreeSelect, {
        placeholder: `请选择${label}`,
        treeData,
        disabled: props?.isDetails,
        ...attribute,
      }),
    datePicker: ({ label, attribute = {} }: FormItem) => (
      <DatePicker
        placeholder={`请选择${label}`}
        format="YYYY-MM-DD"
        dropdownClassName={styles.dropdownDatePicker}
        disabled={props?.isDetails}
        {...attribute}
      />
    ),
    dateRangePicker: ({ attribute = {} }: FormItem) => (
      <RangePicker
        placeholder={['开始时间', '结束时间']}
        format="YYYY-MM-DD"
        dropdownClassName={styles.dropdownDatePicker}
        disabled={props?.isDetails}
        {...attribute}
      />
    ),
    cascade: ({ label, options = [], attribute = {} }: any) => (
      <Cascader
        placeholder={props?.isDetails ? '无' : `请选择${label}`}
        options={options}
        disabled={props?.isDetails}
        {...attribute}
      />
    ),
    customRender: (item: FormItem) => {
      return item?.render && item.render();
    },
  };

  useEffect(() => {
    props.setEditFormData && props.setEditFormData(form);
  }, []);

  //form表单的回显
  useEffect(() => {
    if (props?.formData) {
      let data = formDataDeal(props.formData);
      form.setFieldsValue(data);
    }
  }, [props?.formData]);

  /**
   * 字符串时间转换成moment中能回写在输入框中
   * @param date 时间字符串
   * @param format 时间格式
   */
  const dataSwitch = (date: string, format: string = 'YYYY-MM-DD') => {
    return date ? moment(date, format) : '';
  };

  /**
   * moment的时间转为字符串时间（在提交时用）
   * @param date moment的时间
   * @param format 时间格式
   */
  const dateSwitchString = (date: any, format: string = 'YYYY-MM-DD') => {
    return date ? moment(date).format(format) : undefined;
  };

  /**
   * 表单数据处理
   * @param formData
   * @param type
   */
  const formDataDeal = (formData: any, type?: string) => {
    let newFormData = { ...formData };
    if (formList?.length > 0) {
      formList.map((item: FormItem) => {
        if (item.type === 'datePicker') {
          let time = newFormData[item.name];
          newFormData = {
            ...newFormData,
            [item.name]:
              type == 'submit'
                ? dateSwitchString(time, item?.attribute?.format)
                : dataSwitch(time, item?.attribute?.format),
          };
        } else if (item.type === 'dateRangePicker') {
          //时间范围处理
          if (type == 'submit') {
            //提交时处理成字符串
            const dateRange =
              newFormData[item.name]?.length > 0
                ? newFormData[item.name]
                : undefined;
            newFormData = {
              ...newFormData,
              [item.name]: dateRange
                ? {
                    startTime: dateSwitchString(
                      dateRange[0],
                      item?.attribute?.format,
                    ),
                    endTime: dateSwitchString(
                      dateRange[1],
                      item?.attribute?.format,
                    ),
                  }
                : undefined,
            };
          } else {
            //时间范围回写处理
            const { startTime, endTime } = newFormData[item.name] || {};
            newFormData = {
              ...newFormData,
              [item.name]: [
                dataSwitch(startTime, item?.attribute?.format),
                dataSwitch(endTime, item?.attribute?.format),
              ],
            };
          }
        } else if (item.type === 'cascade') {
          //级联选择
          let cascadeVal = newFormData[item.name];
          if (type === 'submit') {
            //提交时处理
            if (cascadeVal) {
              newFormData[item.name] = cascadeVal.join('-');
            }
          } else {
            if (cascadeVal) {
              newFormData[item.name] = cascadeVal.split('-');
            }
          }
        }
      });
    }
    return newFormData;
  };

  /**
   * 重置要配合着const [form] = Form.useForm()以及form={form}
   */
  const onReset = () => {
    form.resetFields();
  };

  /**
   * 点击添加
   */
  const onAdd = () => {
    props?.onAdd && props?.onAdd();
  };

  /**
   * 点击提交
   * @param values
   */
  const onFinish = async (values: any) => {
    const data = await formDataDeal(values, 'submit');
    props?.onFinish(data);
  };

  /**
   * 获取formItem的Dom
   */
  const getFormItemDom = () => {
    if (customColumn && formLayout !== 'inline') {
      return (
        <Row {...props?.rowAttribute}>
          {formList.map((item: FormItem) => {
            let componentsFunction = components[item.type];
            return (
              <Col span={customColumn} key={item.name} {...props?.colAttribute}>
                <Form.Item
                  label={item.label}
                  name={item.name}
                  rules={item.rules}
                  key={item.name}
                  {...item?.formItemAttribute}
                >
                  {componentsFunction(item)}
                </Form.Item>
              </Col>
            );
          })}
          <Col span={customColumn} {...props?.colAttribute}>
            <Form.Item key={'btn'} hidden={props?.noShowDefaultBtn}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {props?.finishTitle || '搜索'}
                </Button>
                {props?.isReset && (
                  <Button htmlType="button" onClick={onReset}>
                    重置
                  </Button>
                )}
                {Boolean(props?.onAdd) && (
                  <Button type="primary" htmlType="button" onClick={onAdd}>
                    增加
                  </Button>
                )}
                {props?.addButton ? props?.addButton : null}
              </Space>
            </Form.Item>
          </Col>
        </Row>
      );
    } else {
      return formList.map((item: FormItem) => {
        let componentsFunction = components[item.type];
        return (
          <Form.Item
            label={item.label}
            name={item.name}
            rules={item.rules}
            key={item.name}
            {...item?.formItemAttribute}
          >
            {componentsFunction(item)}
          </Form.Item>
        );
      });
    }
  };

  return (
    <div className={styles.formContent}>
      <Form
        layout={formLayout}
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        {...props?.formAttribute}
      >
        {getFormItemDom()}
        {!customColumn || formLayout === 'inline' ? (
          <Form.Item {...buttonItemLayout} hidden={props?.noShowDefaultBtn}>
            <Space>
              {props?.formList?.length > 0 && (
                <Button type="primary" htmlType="submit">
                  {formLayout === 'inline' ? '搜索' : '提交'}
                </Button>
              )}
              {props?.isReset && (
                <Button htmlType="button" onClick={onReset}>
                  重置
                </Button>
              )}
              {Boolean(props?.onAdd) && (
                <Button type="primary" htmlType="button" onClick={onAdd}>
                  增加
                </Button>
              )}
              {props?.addButton ? props?.addButton : null}
            </Space>
          </Form.Item>
        ) : null}
      </Form>
    </div>
  );
};
export default FormContent;
