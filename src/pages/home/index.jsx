import Banner from "../../components/Home/Banner"
import DanhMuc from "../../components/Home/DanhMuc"
import ListSPTheoLoai from "../../components/Home/ListSPTheoLoai"
import ThuongHieu from "../../components/Home/ThuongHieu"

const Home = () => {
  return (
    <div>
        <main className="main_flex" id="home">
            <Banner/>
            <DanhMuc/>
            {/* <ThuongHieu/> */}
            <ListSPTheoLoai/>
        </main>        
    </div>
  )
}
export default Home