import { useEffect, useState } from "react"
import { fetchAllTheLoai } from "../../services/loaiSPAPI"
import { useNavigate } from "react-router-dom"

const DanhMuc = () => {

    const [dataTheLoai, setDataTheLoai] = useState([])
    const navigator = useNavigate()

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


  return (
    <section id="dctd" className="container panel">
        <h2 className="h2_center"><span className="h2_title">Đồ chơi tình dục</span></h2>
        <div className="wrap_items">
            {dataTheLoai.length > 0 ? <>
                {dataTheLoai.map((item, index) => {

                    return (
                        <a href="#" onClick={() => navigator(`/searchsp?IdLoaiSP=${item?._id}`)} className="a_img" key={index}>
                            <img className="js_img_lazy" alt="Sextoy cho nam" src={item?.Icon} />
                            <span className="a_title">{item?.TenLoaiSP}</span>
                        </a>
                    )
                })}
            </> : <></>}                  
        </div>
    </section>
  )
}
export default DanhMuc