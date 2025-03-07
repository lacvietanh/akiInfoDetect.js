# akiInfoDetect

Thư viện JavaScript nhẹ để phát hiện thông tin về nền tảng, trình duyệt và thiết bị của người dùng. Dựa trên Platform.js nhưng đã được cải tiến với nhiều tính năng mới và hiện đại hơn.

## Tính năng

- **Phát hiện thông tin thiết bị**: Trình duyệt, hệ điều hành, kiến trúc CPU, GPU, v.v.
- **Thông tin mạng**: Địa chỉ IP, ISP, quốc gia
- **Thông tin phần cứng**: RAM, số lõi CPU, loại CPU
- **Thông tin màn hình**: Kích thước, độ phân giải, tỷ lệ pixel
- **Thông tin pin**: Trạng thái sạc, mức pin
- **Thông tin vị trí**: Tọa độ địa lý (nếu người dùng cho phép)
- **Thông tin kết nối**: Loại kết nối, tốc độ mạng

## Cài đặt

Chỉ cần thêm script vào trang web của bạn:

```html
<script src="path/to/akiInfoDetect.js"></script>
```

## Cách sử dụng cơ bản

Script này cung cấp một hàm global `akiInfoDetect()` trả về một Promise với thông tin về thiết bị và trình duyệt:

```javascript
// Lấy tất cả thông tin
akiInfoDetect().then(info => {
  console.log(info);
  
  // Sử dụng thông tin
  console.log(`Trình duyệt: ${info.browser}`);
  console.log(`Hệ điều hành: ${info.os.string}`);
  console.log(`CPU: ${info.CPU}`);
  console.log(`Kiến trúc: ${info.arch}`);
  console.log(`RAM: ${info.RAM} GB`);
  console.log(`Số lõi CPU: ${info.CPUCore}`);
  console.log(`GPU: ${info.GPU}`);
  console.log(`Ngôn ngữ: ${info.language}`);
});
```

## Các thuộc tính có sẵn

### Thông tin cơ bản

- `browser`: Tên và phiên bản trình duyệt
- `os`: Thông tin hệ điều hành
  - `os.name`: Tên hệ điều hành (win, mac, linux, android, ios, v.v.)
  - `os.ver`: Phiên bản hệ điều hành dưới dạng số
  - `os.string`: Chuỗi đầy đủ của hệ điều hành
- `product`: Tên sản phẩm (iPhone, iPad, Galaxy S, v.v.)
- `manufacturer`: Nhà sản xuất (Apple, Samsung, Google, v.v.)
- `isMobile`: `true` nếu là thiết bị di động, ngược lại là `false`
- `language`: Ngôn ngữ ưa thích của người dùng (tối đa 3 ngôn ngữ, định dạng 2 ký tự, cách nhau bởi dấu cách)

### Thông tin phần cứng

- `CPU`: Loại CPU (Intel, Apple Silicon, v.v.)
- `CPUCore`: Số lõi CPU
- `arch`: Kiến trúc CPU (x86, x86_64, arm64, v.v.)
- `RAM`: Dung lượng RAM (GB)
- `GPU`: Thông tin về GPU

### Thông tin pin

- `battery.isCharging`: `true` nếu đang sạc, ngược lại là `false`
- `battery.level`: Mức pin (0-100)

### Thông tin mạng

- `network.IP`: Địa chỉ IP
- `network.Ips`: Thông tin ISP
- `network.country`: Mã quốc gia

## Các phương thức có sẵn

### Thông tin mạng

- `getIP(forceRefresh = false)`: Lấy địa chỉ IP
- `getIps(forceRefresh = false)`: Lấy thông tin ISP
- `getCountry(forceRefresh = false)`: Lấy mã quốc gia
- `getNetworkInfo(forceRefresh = false)`: Lấy tất cả thông tin mạng

### Thông tin khác

- `getLocation()`: Lấy vị trí địa lý (cần người dùng cho phép)
- `getConnection()`: Lấy thông tin kết nối mạng
- `getScreen()`: Lấy thông tin màn hình

## Ví dụ sử dụng

### Lấy thông tin mạng

```javascript
akiInfoDetect().then(info => {
  // Lấy địa chỉ IP
  info.getIP().then(ip => {
    console.log(`Địa chỉ IP: ${ip}`);
  });
  
  // Lấy thông tin ISP
  info.getIps().then(isp => {
    console.log(`ISP: ${isp}`);
  });
  
  // Lấy mã quốc gia
  info.getCountry().then(country => {
    console.log(`Quốc gia: ${country}`);
  });
  
  // Lấy tất cả thông tin mạng
  info.getNetworkInfo().then(network => {
    console.log(`IP: ${network.IP}`);
    console.log(`ISP: ${network.Ips}`);
    console.log(`Quốc gia: ${network.country}`);
  });
});
```

### Lấy vị trí địa lý

```javascript
akiInfoDetect().then(info => {
  info.getLocation().then(location => {
    if (location) {
      console.log(`Vĩ độ: ${location.latitude}`);
      console.log(`Kinh độ: ${location.longitude}`);
      console.log(`Độ chính xác: ${location.accuracy} mét`);
    } else {
      console.log('Không thể lấy vị trí hoặc người dùng không cho phép');
    }
  });
});
```

### Lấy thông tin kết nối mạng

```javascript
akiInfoDetect().then(info => {
  info.getConnection().then(connection => {
    if (connection) {
      console.log(`Loại kết nối: ${connection.type}`);
      console.log(`Loại kết nối hiệu quả: ${connection.effectiveType}`);
      console.log(`Tốc độ tải xuống: ${connection.downlink} Mbps`);
      console.log(`Thời gian phản hồi: ${connection.rtt} ms`);
    }
  });
});
```

### Lấy thông tin màn hình

```javascript
akiInfoDetect().then(info => {
  info.getScreen().then(screen => {
    console.log(`Kích thước: ${screen.width}x${screen.height}`);
    console.log(`Kích thước khả dụng: ${screen.availWidth}x${screen.availHeight}`);
    console.log(`Độ sâu màu: ${screen.colorDepth} bit`);
    console.log(`Tỷ lệ pixel: ${screen.devicePixelRatio}`);
    console.log(`Hướng: ${screen.orientation}`);
  });
});
```

## Cơ chế cache

Thông tin mạng (IP, ISP, quốc gia) được lưu trong cache để tránh gọi API quá nhiều lần. Thời gian sống mặc định của cache là 1 giờ.

Để bỏ qua cache và lấy thông tin mới, bạn có thể sử dụng tham số `forceRefresh = true`:

```javascript
// Lấy địa chỉ IP mới, bỏ qua cache
info.getIP(true).then(ip => {
  console.log(`Địa chỉ IP mới: ${ip}`);
});

// Lấy tất cả thông tin mạng mới, bỏ qua cache
info.getNetworkInfo(true).then(network => {
  console.log('Thông tin mạng mới:', network);
});
```

## Xử lý lỗi

Script được thiết kế để xử lý lỗi một cách tốt nhất có thể. Nếu một tính năng không được hỗ trợ hoặc gặp lỗi, nó sẽ trả về giá trị mặc định hoặc `null` thay vì ném ra lỗi.

```javascript
akiInfoDetect().then(info => {
  // Ngay cả khi không thể lấy thông tin GPU, script vẫn hoạt động
  console.log(`GPU: ${info.GPU || 'Không xác định'}`);
  
  // Nếu không thể lấy vị trí, sẽ trả về null
  info.getLocation().then(location => {
    if (location) {
      console.log('Vị trí:', location);
    } else {
      console.log('Không thể lấy vị trí');
    }
  });
});
```

## Tương thích

Script này hoạt động trên hầu hết các trình duyệt hiện đại, bao gồm:

- Chrome
- Firefox
- Safari
- Edge
- Opera

Một số tính năng có thể không hoạt động trên các trình duyệt cũ hoặc các trình duyệt không hỗ trợ các API hiện đại.
