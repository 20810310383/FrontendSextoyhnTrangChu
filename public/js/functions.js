// Xem nhanh video sản phẩm ở trang danh mục
function quickViewVideo() {
    // Sử dụng event delegation
    $(document).on('click', '.product-link', function (e) {
        e.preventDefault(); // Ngăn hành vi mặc định của <a>

        const $this = $(this);
        const videoUrl = $this.data('video');
        const productUrl = $this.data('product-url');

        if (videoUrl) {
            if (!$this.data('video-played')) {
                $this.data('video-played', true); // Đánh dấu đã phát video

                const figure = $this.find('.thumb_p-cate');

                // Hiển thị spinner hoặc text "Vui lòng đợi"
                figure.html(`
                    <div class="video-loading">
                        <div class="spinner"></div>
                        <p>Đang tải Video.Vui lòng đợi...</p>
                    </div>
                `);

                // Tạo thẻ video và gắn sự kiện tải xong
                const video = $(`<video autoplay style="width: 100%; height: auto;" preload="auto">
                                    <source src="${videoUrl}" type="video/mp4">
                                    Trình duyệt của bạn không hỗ trợ video.
                                </video>`);

                video.on('canplay', function () {
                    // Khi video sẵn sàng phát, thay thế spinner bằng video
                    figure.html(video);
                });

                video.on('ended', function () {
                    this.currentTime = 0; // Đặt lại thời gian phát về 0
                    this.play(); // Phát lại video
                });

                figure.append(video);
            } else {
                // Nếu đã phát video, chuyển hướng đến URL sản phẩm
                window.location.href = productUrl;
            }
        } else {
            // Nếu không có video, chuyển hướng đến URL sản phẩm
            window.location.href = productUrl;
        }
    });
}

function scrollHeader(){
    let lastScrollTop = 0; // Vị trí cuộn trước đó
    let lastTimestamp = Date.now(); // Thời gian cuộn trước đó
    const header = $('#header_v3'); // Thay 'header' bằng selector cụ thể nếu cần
    const minScrollSpeed = 1.5; // Tốc độ cuộn tối thiểu (px/ms)
    const stickyThreshold = 100; // Khoảng cách từ đầu trang mà header luôn hiển thị (px)

    $(window).on('scroll', function () {
        const currentScroll = $(this).scrollTop(); // Vị trí cuộn hiện tại
        const currentTimestamp = Date.now(); // Thời gian hiện tại
        const scrollDistance = Math.abs(currentScroll - lastScrollTop); // Khoảng cách cuộn
        const timeElapsed = currentTimestamp - lastTimestamp; // Thời gian giữa các lần cuộn
        const scrollSpeed = scrollDistance / timeElapsed; // Tốc độ cuộn (px/ms)
        // Kiểm tra nếu #black_bg đang hiển thị
        if($("#header_v3 .head_nav").is(':visible')) {
            header.css('transform', 'translateY(0)'); // Hiện header
        }
        else if ($('#black_bg').is(':visible')) {
            header.css('transform', 'translateY(-100%)'); // Luôn ẩn header
        }
        else if (currentScroll <= stickyThreshold) {
            // Nếu trong vùng 120px đầu tiên, luôn hiển thị header
            header.css('transform', 'translateY(0)');
        } else if (currentScroll > lastScrollTop && scrollSpeed > minScrollSpeed) {
            // Cuộn xuống
            header.css('transform', 'translateY(-100%)'); // Ẩn header
        } else if (scrollSpeed > minScrollSpeed) {
            // Cuộn lên với tốc độ đủ nhanh
            header.css('transform', 'translateY(0)'); // Hiện header
        }

        // Cập nhật vị trí và thời gian cuộn
        lastScrollTop = currentScroll;
        lastTimestamp = currentTimestamp;
    });
}

function updateVisibleItems() {
    // Quy định số lượng sản phẩm muốn hiển thị dựa vào kích thước màn hình
    let maxVisibleItems;
    if (window.innerWidth >= 2212 && window.innerWidth <= 2560) {
        maxVisibleItems = 24; // Màn hình lớn: Hiển thị 10 sản phẩm
    } else if (window.innerWidth >= 1840 && window.innerWidth < 2212) {
        maxVisibleItems = 20; // Màn hình trung bình: Hiển thị 6 sản phẩm
    } else {
        maxVisibleItems = 16; // Màn hình nhỏ: Hiển thị 4 sản phẩm
    }

    // Duyệt qua từng container .list_p-cate
    $('.list_p-cate').each(function () {
        const $grid = $(this); // Container hiện tại
        $grid.children().each(function (index) {
            if (index >= maxVisibleItems) {
                $(this).hide(); // Ẩn sản phẩm dư thừa
            } else {
                $(this).show(); // Hiển thị sản phẩm trong giới hạn
            }
        });
    });
}

function change_cate(element) {
    // Chọn danh mục con trong nav header
    var cate = $(element).attr('cate');
    $(element).addClass('selected').siblings().removeClass('selected');
    $.ajax({
        url: APP_URL + "/ajax/home/v3",
        data: { nav_child: cate },
        success: function(data) {
            $("nav.live_nav").html(data['html']);
        }
    })
}

function cart_show(){
    $.ajax({
        url: APP_URL + "/ajax/home/v3",
        data: {cart_show: 'true', act: 'show', pro_id: null, page: window.location.pathname},
        success: function(data){
            $("#js_cart-show").css('display', 'flex');
            $("#black_bg").show();
            $("#js_cart-show").html(data['html']);
        }
    })
}

function scrollToShowAnchor(){
    const $container = $('.head-hashtag');
    const scrollSpeed = 20; // Tốc độ cuộn (pixel mỗi lần lặp)
    let scrolling = null;

    // Tự động cuộn về bên trái
    $container.on('mousemove', function (e) {
        const containerWidth = $container.outerWidth();
        const scrollLeft = $container.scrollLeft();
        const offset = $container.offset();

        // Vị trí con trỏ chuột
        const mouseX = e.pageX - offset.left;

        // Khi di chuột vào bên trái
        if (mouseX < 50 && scrollLeft > 0) {
            clearInterval(scrolling);
            scrolling = setInterval(() => {
                $container.scrollLeft($container.scrollLeft() - scrollSpeed);
            }, 20);
        }
        // Khi di chuột vào bên phải
        else if (mouseX > containerWidth - 50 && scrollLeft < $container[0].scrollWidth - containerWidth) {
            clearInterval(scrolling);
            scrolling = setInterval(() => {
                $container.scrollLeft($container.scrollLeft() + scrollSpeed);
            }, 20);
        }
        // Khi con trỏ không ở các cạnh
        else {
            clearInterval(scrolling);
        }
    });

    // Dừng cuộn khi chuột rời khối
    $container.on('mouseleave', function () {
        clearInterval(scrolling);
    });
}

// Hàm show ảnh trước khi upload
function preview_image(){
    var total_file=document.getElementById("file_thumbnail").files.length;
    for(var i=0;i<total_file;i++)
    {
    $('#image_preview').append("<img src='"+URL.createObjectURL(event.target.files[i])+"'>");
    }
}

// Document Ready: Tất cả các logic được khởi tạo sau khi DOM đã tải xong
$(document).ready(function () {
    // Xem nhanh video sản phẩm
    quickViewVideo();

    // Phần cuộn header
    scrollHeader();

    // Di chuột vào để hiển thị cuộn trang phần anchor - product-detail
    scrollToShowAnchor();
    // Hiển thị giỏ hàng
    $(".header_main .icon_cart").click(function(){
        cart_show();
        $("#header_v3").css('transform', 'translateY(-100%)');
    });
    // Toggle Logo header menu
    $("#header_v3 .nav_main-left li").click(function(){
        if($(this).hasClass('js_logo_toggle')){
            $("li[cate='all'] img").attr('src', APP_URL + '/css/icon/icon_oichin_short.svg').css('filter', 'invert(1)');
        }
        else{
            $("li[cate='all'] img").attr('src', APP_URL + '/css/icon/logo-oichin-short-color.webp').css('filter', 'unset');
        }
    })
    // Quick order - Thêm nhanh 1 sản phẩm vào giỏ hàng
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $(document).on('click', '.quick_cart', function (e) {
        // alert("hi");
        var product_id = $(this).attr('product_id');
        var isset_variant = $(this).attr('variant');
        // Khi không có biến thể, thì thêm id sản phẩm vào giỏ hàng luôn
        function quick_cart(product_id) {
            $.ajax({
                url: APP_URL + "/cart", //"{{ route('cart.store') }}",
                method: "POST",
                data: {
                    product_id: product_id,
                    redirect: 0
                },
                dataType: 'html',
                cache: false,
                success: function(data) {
                    if (data != null) {
                        $('#cart_qty').html(data);
                        cart_show();
                        $("#header_v3").css('transform','translateY(-100%)');
                    }
                }
            });
        }
        if (isset_variant == 0) {
            quick_cart(product_id);
        }
        // Khi có biến thể, thì show popup chọn biến thể
        else{
            console.log('variant, product_id: '+ product_id);
            $.ajax({
                url: APP_URL + "/ajax/home/v3",
                data: {
                    p_cate_variant: 1,
                    product_id: product_id,
                },
                dataType: 'html',
                cache: false,
                success: function(data) {
                    if (data != null) {
                        // console.log(data);
                        $(".popup_fixed-center").show();
                        $(".p_variant").html(data);
                        $("#black_bg").show();
                        $("#header_v3").css('transform','translateY(-100%)');
                        // Xử lý khi chọn biến thể
                        $(".variants img").click(function(){
                            $(".variants img").css('border','unset');
                            $(this).css('border','1px solid #ff2684');
                            // Cập nhật các thông tin chi tiết của biến thể
                            // GIÁ
                            var price = $(this).attr('price_new');
                            price = parseInt(price).toLocaleString('vi',{style : 'currency', currency : 'VND'}); 
                            $("#js_price_new").html(price).fadeOut(100).fadeIn(100);
                            // ẢNH ĐẠI DIỆN
                            var thumbnail = $(this).attr('src');
                            $(".p_variant .thumbnail img").attr('src',thumbnail).fadeOut(100).fadeIn(100);
                            // SKU
                            var sku = $(this).attr('sku');
                            $(".p_variant .thumbnail .sku, #js_sku").html(sku).fadeOut(100).fadeIn(100);
                            // KÍCH THƯỚC
                            var length = $(this).attr('length');
                            if(length != ''){
                                var diameter = $(this).attr('diameter');
                                $("#js_length").html(length).fadeOut(100).fadeIn(100);
                                $("#js_diameter").html(diameter).fadeOut(100).fadeIn(100);
                            }
                            // COLOR
                            var color = $(this).attr('color');
                            if(color != ''){
                                $("#js_color_id").html(color);
                            }
                            // console.log(price + 'thumbnail' + color);
                            var special = $(this).attr('special');
                            if(special != ''){
                                $(".js_special").show();
                                $("#js_special_detail").html(special);
                            }
                            //Cập nhật id sản phẩm cho đặt hàng
                            var id = $(this).attr('id');
                            $(".cta_variant>div").attr('product_id',id);
                        })
                        // Quick Cart
                        $(".p_variant .cta_variant .add_cart").click(function(){
                            var variant_id_selected = $(".p_variant .cta_variant .add_cart").attr('product_id');
                            quick_cart(variant_id_selected);
                            $(".popup_fixed-center").hide();
                        })
                    }
                }
            });
        }
    });
});