/* 默认 schema */
const defaultSchema = [
  {
    'key': 'ROOT',
    'type': 'object',
    'isRoot': true,
    'schema': [
      {
        'key': 'errmsg',
        'type': 'exactly',
        'condition': '',
        'placeholder': '错误信息'
      },
      {
        'key': 'errno',
        'type': 'interge',
        'condition': '',
        'placeholder': '接口状态码'
      },
      {
        'key': 'result',

        'type': 'array',
        'condition': '',
        'placeholder': '生成多少条数据?',
        'schema': [
          {
            'key': 'item_id',
            'type': 'index',
            'condition': '',
            'placeholder': '从多少开始?默认1'
          }
        ]
      }
    ]
  }

]
export default defaultSchema
