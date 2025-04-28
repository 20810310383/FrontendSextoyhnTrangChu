import { useEffect, useState } from "react";
import Product from "../../components/Product/Product"
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchAllTheLoai, fetchOneTheLoai } from "../../services/loaiSPAPI";
import { fetchAllProduct } from "../../services/productAPI";
import { Col, Divider, Pagination, Row, Select, Typography } from "antd";
const { Title } = Typography;
const ListSP = () => {

    const [selectedLocTheoGia, setSelectedLocTheoGia] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const querySearch = searchParams.get('query');
    let idLoaiSP = searchParams.get('IdLoaiSP')

    const [dataListSP, setDataListSP] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [total, setTotal] = useState(0)
    const [selectedLoaiSP, setSelectedLoaiSP] = useState([]);
    const [dataLoaiSP, setDataLoaiSP] = useState([]);
    const [sortField, setSortField] = useState("default");
    const [sortOrder, setSortOrder] = useState(null);

    // const dataTheLoai = useSelector(state => state.category.listCategorys.data)
    const [dataTheLoai, setDataTheLoai] = useState([])

    useEffect(() => {
        fetchListTL()
    }, [])

    const fetchListTL = async (id) => {
        let query = `page=1&limit=9999`           
    
        const res = await fetchAllTheLoai(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataTheLoai(res.data)
        }
    }

    const fetchOneLSP = async () => {
        let query = ''
    
        if (idLoaiSP) {
            query += `IdLoaiSP=${idLoaiSP}`;  // Chuyển mảng thành chuỗi cách nhau bằng dấu phẩy
        }          
    

        const res = await fetchOneTheLoai(query)
        if (res && res.data) {
            setDataLoaiSP(res.data)
        }
    }

    const fetchListSP = async () => {
        let query = `page=${current}&limit=${pageSize}`     

        // Kiểm tra nếu idLoaiSP là mảng hoặc một giá trị đơn
        const idLoaiSPArray = Array.isArray(idLoaiSP) ? idLoaiSP : [idLoaiSP];  // Nếu không phải mảng, chuyển thành mảng
  
        if (querySearch) {
          query += `&TenSP=${encodeURIComponent(querySearch)}`;
        }          
        // Nếu selectedLoaiSP là mảng, chuyển nó thành chuỗi query
        if (selectedLoaiSP && selectedLoaiSP.length > 0) {
            query += `&locTheoLoai=${encodeURIComponent(JSON.stringify(selectedLoaiSP))}`;
        }       
        if (idLoaiSP) {
            query += `&IdLoaiSP=${idLoaiSP}`;  // Chuyển mảng thành chuỗi cách nhau bằng dấu phẩy
        }         
        if (selectedLocTheoGia) {
            query += `&locTheoGia=${encodeURIComponent(selectedLocTheoGia)}`;
        }    
        
        if (sortField !== "default" && sortOrder) {           
            query += `&sort=${sortField}&order=${sortOrder}`;
        }
    
        const res = await fetchAllProduct(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataListSP(res.data)
            setTotal(res.totalSanPham)
        }
    }

    const locTheoGia = [
        {_id: 0, value: "1-999999999", label: "Tất cả"},
        {_id: 1, value: "1-100000", label: "Dưới 100.000đ"},
        {_id: 2, value: "100000-500000", label: "100.000đ - 500.000đ"},
        {_id: 3, value: "500000-1000000", label: "500.000đ - 1.000.000đ"},
        {_id: 4, value: "1000000-2000000", label: "1.000.000đ - 2.000.000đ"},
        {_id: 5, value: "2000000-3000000", label: "2.000.000đ - 3.000.000đ"},
        {_id: 6, value: "3000000-5000000", label: "3.000.000đ - 5.000.000đ"},
        {_id: 7, value: "5000000-999999999", label: "5.000.000đ đổ lên"},
    ]
    

    const onChangeTheoGia = async (e) => {
        console.log("e: ", e);
        setSelectedLocTheoGia(e)
    }

    const onChangeTheoLoai = async (e) => {
        console.log("e: ", e);
        setSelectedLoaiSP(e)
    }

    const onChangePagination = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }

        // Cuộn về đầu trang
        window.scrollTo({ top: 10, behavior: 'smooth' });
    }

    useEffect(() => {
        if (selectedLocTheoGia) {
            fetchListSP();
        } else {
            fetchListSP(); // Nếu không có loại nào được chọn, fill lại giá trị bandđầu
        }
    }, [selectedLocTheoGia]);

    useEffect(() => {
        fetchListSP()
    }, [sortField, sortOrder, querySearch, current, pageSize, selectedLocTheoGia, idLoaiSP, selectedLoaiSP])

    useEffect(() => {
        if (idLoaiSP) {
            fetchOneLSP();
        } else {
            fetchOneLSP(); 
        }
    }, [idLoaiSP]);

  return (
    <div>
        <main className="main_flex" id="home">
            <br />
            {(!dataLoaiSP.TenLoaiSP && !querySearch) && (
            <div className="category-name-detail">
                <Title level={4}>SẢN PHẨM TRONG CỬA HÀNG</Title>
                <div className="clear" />
            </div>
            )}

            {querySearch ? (
            <div className="category-name-detail">
                <Title level={4}>Kết quả tìm kiếm: {querySearch}</Title>
                <div className="clear" />
            </div>
            ) : dataLoaiSP.TenLoaiSP && (
            <div className="category-name-detail">
                <Title level={4}>Danh mục thể loại: {dataLoaiSP.TenLoaiSP}</Title>
                <div className="clear" />
            </div>
            )}
            <Divider/>
            <Row gutter={[10,15]} style={{width: "50%", margin: "0 auto"}}>
                <Col md={8} xs={24} sm={24}>
                    <Select
                        defaultValue="default"
                        placeholder="Sắp xếp theo giá sản phẩm"
                        size="large"
                        style={{ width: "100%" }}
                        onChange={(value) => {
                            if (value === "default") {
                            setSortField("default");
                            setSortOrder(null);
                            } else {
                            setSortField("sizes"); // field trong DB để sắp xếp
                            setSortOrder(value); // asc hoặc desc
                            }
                        }}
                        >
                        <Option value="default">Mặc định</Option>
                        <Option value="asc">Giá tăng dần</Option>
                        <Option value="desc">Giá giảm dần</Option>
                    </Select>
                </Col>
                <Col md={8} xs={24} sm={24}>
                    <Select
                        size="large"
                        showSearch
                        placeholder="Lọc theo giá"
                        value={selectedLocTheoGia}
                        onChange={(e) => onChangeTheoGia(e)}
                        style={{ width: "100%" }}
                        options={locTheoGia.map((item) => ({
                            value: item.value,
                            label: item.label,
                        }))}
                        filterOption={(input, option) => {
                            return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                        }}  
                    />                     
                </Col>
                <Col md={8} xs={24} sm={24}>
                {idLoaiSP ? <>
                </> : <>
                    <Select
                        showSearch
                        mode="multiple"
                        size="large"
                        placeholder="Lọc theo loại sản phẩm"
                        value={selectedLoaiSP}
                        onChange={(e) => onChangeTheoLoai(e)}
                        style={{ width: "100%" }}
                        options={dataTheLoai?.map((item) => ({
                            value: item._id,
                            label: item.TenLoaiSP,
                        }))}
                        filterOption={(input, option) => {
                            return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                        }}  
                    />            
                </>}
                </Col>
            </Row>

            {/* <section id="aj_sextoy-cho-nu" className="cates js_cates">   */}
                <section id="list_p" className="list_p-cate" js_alias="bao-cao-su" js_page={2} type="cate_id" js_id={18} js_query js_search>    
                {dataListSP.length > 0 ? <>
                {dataListSP?.map((item,index) => {
                    return (                          
                        <Product dataSP={item}/>
                    )
                })}                   
                </> : <>Chưa có sp</>}

                </section>
                <Pagination 
                    style={{
                        fontSize: "17px",
                        display: "flex",
                        justifyContent: "center",
                        margin: "10px 0 20px 0"
                    }}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    // onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                    onChange={(p, s) => onChangePagination({ current: p, pageSize: s })}
                    showSizeChanger={true}
                    showQuickJumper={true}
                    showTotal={(total, range) => (
                        <div>{range[0]}-{range[1]} trên {total} sản phẩm</div>
                    )}
                    locale={{
                        items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                        jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                        jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                        page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                    }}
                />
            {/* </section> */}
        </main>
    </div>
  )
}
export default ListSP