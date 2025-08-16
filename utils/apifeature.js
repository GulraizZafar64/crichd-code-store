// this.query=product.find
// mtlb k this.query ma sari products agai 1:45...

// this.queryStr=keyword value..
// keyword ki value wo hoti jo keyword k sth likhi ho jasa price 12000 price keyword haa or queryStr 12000 haa 

//ab keyword kiaa haa postman ma jb hm price ka keyword banata  haa toh aga value milti haa ak br postman open kr or waha gell all prdoucts k rout per keywords hoga baki agr nai smj ai toh 
// total all over from start...................
// 1:24... mint ......


class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr
    }
    //ya search iss liya use kiya tha agr use kuch b search krra toh wo product ajaa
    search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }:{};
        this.query=this.query.find({...keyword})
        return this
    }
    // ya agr user categories sa search krra ya price sa
    filter(){
        const queryCopy={...this.queryStr}
        //removing some fields for category
        const removeField=["keyword","page","limit"];
        removeField.forEach(key=>delete queryCopy[key])
        ///for price and rating
        let queryStr=JSON.stringify(queryCopy)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`)
        this.query=this.query.find(JSON.parse(queryStr))
        console.log(queryStr);
        return this
    }
    //ya function iss liya use huva haa k agr hmna ak page ma 5 products dikhani  ho total 20 haa toh her page ma 5 5 product  show krvani ho  1:45 mint .....
    pagination(resultPerPage){
       const currentPage=Number(this.queryStr.page)||1
       const skip=resultPerPage*(currentPage-1)
       this.query=this.query.limit(resultPerPage).skip(skip)
       return this
    }
}
module.exports=ApiFeatures