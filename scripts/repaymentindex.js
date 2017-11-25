// ----------------------下拉框JS部分开始
  var start = {
        elem: '#s_time',
        format: 'YYYY-MM-DD hh:mm',
        min: '1970-00-00 00:00:00', //设定最小日期为当前日期
        max: '2099-06-16 23:59:59', //最大日期
        istime: true,
        istoday: true,
        choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
        }
    };
    var end = {
        elem: '#e_time',
        format: 'YYYY-MM-DD hh:mm',
        min: laydate.now(),
        max: '2099-06-16 23:59:59',
        istime: true,
        istoday: true,
        choose: function(datas){
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };
    laydate(start);
    laydate(end);

    
  // ----------------------下拉框JS部分结束

  // ----------------------分页代码开始
  class Wkrpage {
    constructor({ page = 1, cbPrev = () => { }, cbNext = () => { }, cbJump = () => { }, cbSpot = () => { } }) {
      this.cbJump = cbJump;
      this.cbNext = cbNext;
      this.cbPrev = cbPrev;
      this.cbSpot = cbSpot;
      this.page = page || 1;
      this.pageTwo = 2;
      this.pageThree = 3;
      this.nextPage = this.nextPage.bind(this);
      this.prevPage = this.prevPage.bind(this);
      this.jumpPage = this.jumpPage.bind(this);
      this.spotPage = this.spotPage.bind(this);
      this.initItem=this.initItem.bind(this);
      this.maxPage = 10;
      this.init();
    }
    init() {
      this.initItem();
      const self = this;
      console.log(document.querySelector('#wkr_next'));
      document.querySelector('#wkr_next').addEventListener('click', this.nextPage);
      document.querySelector('#wkr_prev').addEventListener('click', this.prevPage);
      document.querySelector('#wkr_jump').addEventListener('click', this.jumpPage);
      document.querySelectorAll('.wkr_item').forEach((item, index) => {
        item.addEventListener('click', function () {
  
          self.spotPage(this.innerText);
  
        })
      })
    }
    prevPage() {
      this.page--;
      if (this.page === 0) {
        this.page++;
        alert('注意！！！已经是第一页了！！！')
        return;
      } else if (this.page > 3) {
        this.pageTwo = this.page - 1;
        this.pageThree = this.page;
      } else if (this.page <= 3) {
        this.pageTwo = 2;
        this.pageThree = 3;
      }
      this.cbPrev(this.initItem)
      // this.cbPrev();
      // this.initItem();
    }
    nextPage() {
      ++this.page;
      if (this.page > this.maxPage) {
        this.page--;
        alert('注意！！！已经是最后一页了！！！')
        return;
      } else {
        if (this.page >= 3 && this.page <= this.maxPage) {
          this.pageThree = this.page;
          this.pageTwo = this.page - 1;
        }
        this.cbNext(this.initItem);
        // this.cbNext();
        // this.initItem();
      }
    }
    jumpPage() {
      const newPage = document.querySelector('#wkr_page').value;
      if (newPage < 1) {
        alert('请输如有效页码数！');
        return;
      }
      if (newPage <= 3) {
        this.pageTwo = 2;
        this.pageThree3;
      } else if (newPage < this.maxPage && newPage > 3) {
        this.pageTwo = newPage - 1;
        this.pageThree = newPage;
      } else {
        alert('sorry！页面已经超出查询范围，请重新输入！');
        return;
      }
      this.page = newPage;
      this.cbJump(this.initItem());
      // this.cbJump();
      // this.initItem();
    }
    spotPage(v) {
      if (Number(v) === 1) {
        this.pageTwo = 2;
        this.pageThree = 3;
      }
      this.page = v;
      this.cbSpot(this.initItem())
      // this.cbSpot();
      // this.initItem();
    }
    initItem() {
      const pageItems = document.querySelectorAll('.wkr_item');
  
      pageItems[0].innerText = 1;
      pageItems[1].innerText = this.pageTwo;
      pageItems[2].innerText = this.pageThree;
  
      console.log('init')
      Array.from(pageItems, (item, index) => {
        const nowPage = Number(item.innerText);
        if (Number(nowPage) === Number(this.page)) {
          item.className = item.className + ' selected'
        } else {
          item.className = item.className.replace(/selected/g, '')
        }
      })
    }
  
  }

  // -----------------分页代码结束
  
  
  // ----------------按钮点击逻辑
    const repay={
      timer:null,
      start_time:'',
      end_time:'',
      page:'',
      MyPage:{},
      init(){
        const self=this;

        // 进入页面首先请求默认数据
        self.getData({
          // cb:this.render
        })

        this.MyPage=new Wkrpage({
          page:this.page,
          cbJump(cb){
           self.getData({
              data:self.getParams(),
              cb,
            })
          },
          cbNext(cb){
            console.log(cb)
           self.getData({
              data:self.getParams(),
              cb,
            })
          },
          cbPrev(cb){
           self.getData({
              data:self.getParams(),
              cb,
            })
          },
          cbSpot(cb){
           self.getData({
              data:self.getParams(),
              cb,
            })
          }

        })

        // 搜索按钮
        document.querySelector('#repay_search').addEventListener('click',()=>{this.search(this)});

        // 弹窗上关闭与取消按钮
        $('aside ').on('click','.cancel',this.cancelRepay);

        // // 购买列表button
        $(document).on('click','.repay_buyList',()=>{location.href='./repaymentList';});

        // 选择按钮
        $(document).on('click','.item-select',function(){$(this).toggleClass('jello').parents('li').toggleClass('current')})

        // // 还款button
        $(document).on('click','.repay_toPay',(e)=>{this.sureAlt('.alt_repay',e)});
        // 还款确定
        $(document).on('click','.alt_repay .sure',this.sureRepay);


        // 短信通知
        $(document).on('click','.repay_msg',(e)=>{this.sureAlt('.alt_msg',e)});
        // 短信确定
        $(document).on('click','.alt_msg .sure',this.sureMsg);        


        // // 批量还款
        $(document).on('click','#repay_all',()=>{this.sureAlt('.alt_allRepay')})

        // 状态筛选
        $(document).on('change','#pay_status',(e)=>{
          const status=e.target.value;
          this.changeStatus(status);
        })


        // 监听滑动隐现toTop
        window.onscroll=()=>{

          const scrolltop=document.documentElement.scrollTop||document.body.scrollTop;
          const disHeight=document.body.clientHeight;

          if(scrolltop>200){
            $('.toTop').find('img').removeClass('fadeOut').addClass('bounceInUp current');
          }else{
            $('.toTop').find('img').addClass('fadeOut').removeClass('bounceInUp current');            
          } 
        }


        // 回到顶部
        $(document).on('click','.toTop img',()=>{
          $('body,html').animate({scrollTop:0},500);
        });


      },
      search:(obj)=>{
          const searchData={
            start_time:$('#s_time').val()||'',
            end_time:$('#e_time').val()||'',
            project_name:$('#p_title').val()||'',
          };
          obj.getData({
            data:searchData,
            cb:obj.render
          })
      },
      repayAll(){

      },

      // 还款函数
      repayOut(){

        const proInfor=$()

        $.ajax({
          type:'get',
          url:'./repaymentOper',
          data:{
            // projectNo:
          }
        })

      },
      // 确定还款btn
      sureRepay(){

        const proInfor=$('aside .alt_repay').data('json');

        $.ajax({
          type:'get',
          url:'./repaymentOper',
          data:Object.assign({},proInfor,{
            expectPayCompany:'YEEPAY',
            bankcode:'ABOC',
            title:'11',
          }),
          success(res){
            if(res.status==0){
              alert(res.msg)
            }else{
              alert(res.msg)
            }
          }
        })
      },

      // 短信确定
      sureMsg(){

      },

      // 还款、批量等确认弹窗
      sureAlt(slt,e){


        document.querySelector('aside').className=document.querySelector('aside').className+' current';
        document.querySelector(slt).className=document.querySelector(slt).className+' current'; 

        $('aside').find(slt).find('')

        if(slt==='.alt_repay'){
          // 还款附加信息
          const dom=e.target;

          const $li=$(dom).parents('li');


          const proInfor={
            projectNo:$li.find('.item-project').data('value'),
            financingId:$li.find('.item-fid').data('value'),
            paidInterestMoney:$li.find('.item-interest').data('value'),
            paidCapitalMoney:$li.find('.item-capital').data('value'),
            title:$li.find('.item-title').data('value'),
            repaymentId:$li.find('.item-due_id').data('value'),
          };

          $('aside').find(slt).attr('data-json',JSON.stringify(proInfor)).find('.project').text(proInfor.title).siblings('.capital').text(proInfor.paidCapitalMoney);
        }else if(slt==='.alt_allRepay'){
          // 批量还款附加信息
          const proInfor={

          }
        }
        



      },

      // 取消和关闭弹窗
      cancelRepay(){
        $('aside').addClass('fadeOut').children('section').addClass('fadeOut');
        clearTimeout(this.timer);
        this.timer=null;
        this.timer=setTimeout(()=>{
          
          $('aside').removeClass('fadeOut').removeClass('current').children('section').removeClass('fadeOut').removeClass('current');
          
        },300)

        
      },

      // 筛选状体
      changeStatus(status){
        const items=document.querySelector('.list').querySelectorAll('li');

        Array.from(items,(item,idx)=>{
          if(idx===0) return ;
          if(status==='item_all'){

            item.className=item.className.replace(/hidden/g,'');
          }else{
            if(item.className.includes(status)){
              item.className=item.className.replace(/hidden/g,'')
            }else{
              item.className=item.className+' hidden'
            }
            
          }
        })
      },

      // 获取时间与产品名称、页码shu
      getParams(){
        const start_time=document.querySelector('#s_time').value||'';
        const e_time=document.querySelector('#e_time').value||'';
        const project_name=document.querySelector('#p_name').value||'';
        const p=document.querySelector('.wkr_pages').querySelector('.selected').innerText||1;
        return {
          start_time,e_time,project_name,p,
        }
      },


      // 获取列表
      getData({data,cb}){
          // const {data,cb}=props;
          const json=data||{
            start_time:'',
            end_time:'',
            project_name:'',
            p:'1',
            page_size:'20',
          };
          const self=this;
          $.ajax({
            type:'get',
            url:'./getRepaymentIndexList',
            data:json,
            // beforeSend(){
            //   console.log(json)
            // },
            success:(res)=>{
              self.render(res);
              if(cb){
                cb(res);
              }
            }
          })
        
      },
      formatParams(data){
        let arr = [];
        for (let name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".", ""));
        return arr.join("&");
      },

      // 渲染列表
      render(res){
        $('#pay_status').val($(' .item_all').val());
        if(Number(res.status)===1&&res.data.length===0){
          let listContent=`<li><span>请选择</span><span>标的编号</span><span>产品名称</span><span>融资方</span><span>付息时间</span><span>募集金额(元)</span><span>幽灵账户金额</span><span>支付总利息</span><span>支付本金</span><span>本息和</span><span>状态</span><span>是/否逾期</span><span>操作</span></li>`;
          document.querySelector('.list').querySelector('ul').innerHTML=listContent;          
        }
        if(Number(res.status)===1&&res.data.length>0){
          const data=res.data;

          $('footer').addClass('current');

          document.querySelector('#capital_total').innerHTML=`${res.pay_capital_total}元`;
          document.querySelector('#interest_total').innerHTML=`${res.pay_interest_total}元`;

          let listContent=`<li><span>还款ID</span><span>标的编号</span><span>产品名称</span><span>融资方</span><span>付息时间</span><span>募集金额(元)</span><span>幽灵账户金额</span><span>支付总利息</span><span>支付本金</span><span>本息和</span><span>状态</span><span>是/否逾期</span><span>操作</span></li>`;

          Array.from(data,(item,index)=>{
            listContent+=`<li class=${item.status==4?'item_will':'item_has'} ><span class=item-due_id data-value=${item.due_id}>${item.due_id}</span><span data-value=${item.id} class=item-project>${item.id}</span><span class=item-title data-value=${item.title}>${item.title}</span><span class=item-fid data-value=${item.fid}>${item.financing}</span><span>${item.due_time}</span><span>${item.amount}(元)</span><span>${item.total_ghost_amount}</span><span class=item-interest data-value=${item.total_due_interest}>${item.total_due_interest}</span><span class=item-capital data-value=${item.total_due_capital}>${item.total_due_capital}</span><span>${item.total_due_amount}</span><span>${item.status==3?'还款中':'已还款'}</span><span>${item.is_overdue?'逾期':'未逾期'}</span><span><i  class=${item.status==3?'repay_toPay hvr-backward hvr-shadow':"repay_msg hvr-backward hvr-shadow "}>${item.status==3?'还款':'短信通知'}</i><i  class='repay_buyList hvr-backward hvr-shadow'>购买列表</i></span></li>`
          });

          document.querySelector('.list').querySelector('ul').innerHTML=listContent;

        }
      }
    } ;
    repay.init();