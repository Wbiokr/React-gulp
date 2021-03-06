
const Header=()=>(
  <header className='cnt_title'>
    账户流水<span></span>
  </header>
)

class Input extends React.Component{
  render(){
    const {id,name,placeholder,change}=this.props;
    return (
      <input ref='time'  type='text' id={id} name={name} placeholder={placeholder} className={name?'laydate-icon':''}  />
    )

  }
}

const Button=(props)=>{
  const {txt,id,cb}=props;
  const clickFun=props.clickFun||function(){}
  return (
    <input type="button" id={id} value={txt} onClick={cb} onClick={clickFun} />
  )
}

class SelectDate extends React.Component{
  constructor(props){
    super(props);
    this.state={
      start:'',
      end:'',
    }
  }
  render(){
    console.log(this)
    const iptS={
      id:'s_time',name:'s_time',placeholder:'请输入开始日期',
    };
    const iptE={
      id:'e_time',name:'e_time',placeholder:'请输入结束日期',
    };
    const iptN={
      id:'e_num',placeholder:'请输入查询订单号',
    }
    return(
      <section className="cnt_date">
        <p>
          <span>开始日期</span>
          <Input ref='start'  {...iptS}/>
          <Input ref='end' {...iptE} />
          <span>订单号：</span>
          <Input ref='num' {...iptN} />
          <Button txt='搜索' id='cnt_search' {...{clickFun:()=>{
            const start=this.refs.start.refs.time.value;
            const end=this.refs.end.refs.time.value;
            this.props.search({start,end});
          }}}/>
          <Button txt='划充' id='cnt_rec' {...{clickFun:()=>{
            console.log(1111)
          }}} />
        </p>
      </section>
    )
  }
  change(payload){
    if(payload.prop==='start'){
      this.setState({
        start:payload.value
      })
    }else{
      this.setState({
        end:payload.value
      })
    }
  }
}

// 表格部分
class List extends React.Component{
  render(){
    const title=['序号','订单号','金额','资金去向','交易时间'];
    
    let listCnt =  this.props.list.map((item,index)=>{
        const list=item;
       return <li>
                <span>{item.id||''}</span>
                <span>{item.request_no||''}</span>
                <span>{item.amount||''}</span>
                <span>{item.amount||''}</span>
                <span>{item.transaction_time||'未知'}</span>
              </li>
    })
    return (
      <ul className='cnt_list'>
      <li>
        {
          title.map((item,idx)=>(
              <span>{item}</span>
            ))
          }
      </li>
        {listCnt}
      </ul>
    )
  }
}

const Footer=(payload)=>{
  return (
    <section className='cnt_footer'>
      <span>营销消费金额：{11}，</span>
      <span>账户充值金额：{22}，</span>
    </section>
  )
}



class Main extends React.Component{
  constructor(props){
    super(props);
    // this.formatParams=this.formatParams.bind(this);
    this.search=this.search.bind(this);
    this.state={
      list:[],
      p:1,
      money:{}

    }
  }
  render(){
    const list=this.state.list;
    const search=this.search;
    return (
      <article>
        <Header />
        <SelectDate {...{search}} ref='data'/>
        <List {...{list}} />
        <Footer />
      </article>
    )
  }
  componentDidMount(){
    this.getData({})
  }
  search(payload){
    this.p=1;

    this.getData({
      start_time:payload.start,
      end_time:payload.end,
    })

  }
  getData({accountName='SYS_GENERATE_002',start_time='',end_time='',page_size=20,p=this.p}){
    const self=this;
    $.ajax({
      url:'../wallet/getAccountList',
      type:'get',
      data:{accountName,start_time,end_time,page_size,p},
      success:function(res){
        if(Number(res.status)==1){
          self.setState({
            list:res.data,
            money:{
              finance_recharge_money:res.finance_recharge_money,res,
              row_filling_money:res.row_filling_money,
            }
          })

        }
      }
    })
  }
 
}


ReactDOM.render(
  <Main />,
  document.querySelector('#app')
)

