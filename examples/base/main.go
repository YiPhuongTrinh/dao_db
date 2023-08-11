package main

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/ghupdate"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	app := pocketbase.New()
	// *-----------------------------------------------------------------
	// * CODE CÓ THỂ THÊM CHỨC NĂNG BACKEND Ở ĐÂY
	// *-----------------------------------------------------------------
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method:  http.MethodGet,
			Path:    "/vnpay_return",
			Handler: handleVnPayReturn,
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
			},
		})

		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method:  http.MethodGet,
			Path:    "/vnpay_ipn",
			Handler: handleVnPayIPN,
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
			},
		})

		return nil
	})

	// app.OnRecordAfterCreateRequest().Add(func(e *core.RecordCreateEvent) error {
	// 	log.Println(e.Record.Id)
	// 	return nil
	// })

	// if err := app.Start(); err != nil {
	// 	log.Fatal(err)
	// }

	// ---------------------------------------------------------------
	// Optional plugin flags:
	// ---------------------------------------------------------------

	var hooksDir string
	app.RootCmd.PersistentFlags().StringVar(
		&hooksDir,
		"hooksDir",
		"",
		"the directory with the JS app hooks",
	)

	var hooksWatch bool
	app.RootCmd.PersistentFlags().BoolVar(
		&hooksWatch,
		"hooksWatch",
		true,
		"auto restart the app on pb_hooks file change",
	)

	var hooksPool int
	app.RootCmd.PersistentFlags().IntVar(
		&hooksPool,
		"hooksPool",
		50,
		"the total prewarm goja.Runtime instances for the JS app hooks execution",
	)

	var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"",
		"the directory with the user defined migrations",
	)

	var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"automigrate",
		true,
		"enable/disable auto migrations",
	)

	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(
		&publicDir,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path (eg. when pretty urls are used with SPA)",
	)

	var queryTimeout int
	app.RootCmd.PersistentFlags().IntVar(
		&queryTimeout,
		"queryTimeout",
		30,
		"the default SELECT queries timeout in seconds",
	)

	app.RootCmd.ParseFlags(os.Args[1:])

	// ---------------------------------------------------------------
	// Plugins and hooks:
	// ---------------------------------------------------------------

	// load jsvm (hooks and migrations)
	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir: migrationsDir,
		HooksDir:      hooksDir,
		HooksWatch:    hooksWatch,
		HooksPoolSize: hooksPool,
	})

	// migrate command (with js templates)
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  automigrate,
		Dir:          migrationsDir,
	})

	// GitHub selfupdate
	ghupdate.MustRegister(app, app.RootCmd, ghupdate.Config{})

	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		app.Dao().ModelQueryTimeout = time.Duration(queryTimeout) * time.Second
		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS(publicDir), indexFallback))
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

// the default pb_public dir location is relative to the executable
func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}

func handleVnPayReturn(c echo.Context) error {
	vnpParams := c.QueryParams()
	secureHash := vnpParams.Get("vnp_SecureHash")
	delete(vnpParams, "vnp_SecureHash")
	delete(vnpParams, "vnp_SecureHashType")

	vnpParams = sortParams(vnpParams)

	// tmnCode := "your_tmn_code"
	secretKey := "XYIJFBLKPSQWZVZKZEDYVFFMFVRJTCPD"

	signData := url.Values(vnpParams).Encode()
	mac := hmac.New(sha512.New, []byte(secretKey))
	mac.Write([]byte(signData))
	signed := hex.EncodeToString(mac.Sum(nil))

	// fmt.Println(string("\033[36m"), "SIGNEDDATA", string("\033[33m"), signData)
	// fmt.Println(string("\033[36m"), "SIGNED", string("\033[33m"), signed)
	// fmt.Println(string("\033[36m"), "SECURE", string("\033[33m"), secureHash)

	if secureHash == signed {
		// Kiểm tra dữ liệu trong database và thông báo kết quả
		return c.Render(http.StatusOK, "success", map[string]interface{}{
			"code": vnpParams.Get("vnp_ResponseCode"),
		})
	} else {
		return c.Render(http.StatusOK, "success", map[string]interface{}{
			"code": "97",
		})
	}
}

func sortParams(params url.Values) url.Values {
	keys := make([]string, 0, len(params))
	for key := range params {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	sortedParams := make(url.Values)
	for _, key := range keys {
		sortedParams[key] = params[key]
	}

	return sortedParams
}

func handleVnPayIPN(c echo.Context) error {
	app := pocketbase.New()
	vnpParams := c.QueryParams()

	secureHash := vnpParams.Get("vnp_SecureHash")
	// orderID := vnpParams.Get("vnp_TxnRef")
	// rspCode := vnpParams.Get("vnp_ResponseCode")

	delete(vnpParams, "vnp_SecureHash")
	delete(vnpParams, "vnp_SecureHashType")

	vnpParams = sortParams(vnpParams)

	secretKey := "XYIJFBLKPSQWZVZKZEDYVFFMFVRJTCPD"

	signData := url.Values(vnpParams).Encode()
	mac := hmac.New(sha512.New, []byte(secretKey))
	mac.Write([]byte(signData))
	signed := hex.EncodeToString(mac.Sum(nil))

	// fmt.Println(string("\033[36m"), "SIGNEDDATA", string("\033[33m"), signData)
	// fmt.Println(string("\033[36m"), "SIGNED", string("\033[33m"), signed)
	// fmt.Println(string("\033[36m"), "SECURE", string("\033[33m"), secureHash)

	//** Lấy dữ liệu records từ Database đã tạo từ bước 1 */
	app.Bootstrap()
	records, err := app.Dao().FindFirstRecordByData("izsn0q1p388a42f", "vnp_TxnRef", vnpParams.Get("vnp_TxnRef"))
	// fmt.Println(records)
	if err != nil {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"RspCode": "01",
			"Message": "Order not found",
		})
	}
	//** Cập nhật dữ liệu vừa lấy từ IPN ở bước 2 */

	// vnp_Amount := vnpParams.Get("vnp_Amount")
	vnp_Amount_Sort := vnpParams.Get("vnp_Amount")[:len(vnpParams.Get("vnp_Amount"))-2]
	// fmt.Println(`vnp_Amount`, vnp_Amount)

	vnp_BankCode := vnpParams.Get("vnp_BankCode")
	// fmt.Println(`vnp_BankCode`, vnp_BankCode)
	vnp_CardType := vnpParams.Get("vnp_CardType")
	// fmt.Println(`vnp_CardType`, vnp_CardType)
	vnp_OrderInfo := vnpParams.Get("vnp_OrderInfo")
	// fmt.Println(`vnp_OrderInfo`, vnp_OrderInfo)
	vnp_PayDate := vnpParams.Get("vnp_PayDate")
	// fmt.Println(`vnp_PayDate`, vnp_PayDate)
	vnp_ResponseCode := vnpParams.Get("vnp_ResponseCode")
	// fmt.Println(`vnp_ResponseCode`, vnp_ResponseCode)
	vnp_TmnCode := vnpParams.Get("vnp_TmnCode")
	// fmt.Println(`vnp_TmnCode`, vnp_TmnCode)
	vnp_TransactionNo := vnpParams.Get("vnp_TransactionNo")
	// fmt.Println(`vnp_TransactionNo`, vnp_TransactionNo)
	vnp_TransactionStatus := vnpParams.Get("vnp_TransactionStatus")
	// fmt.Println(`vnp_TransactionStatus`, vnp_TransactionStatus)
	vnp_TxnRef := vnpParams.Get("vnp_TxnRef")
	// fmt.Println(`vnp_TxnRef`, vnp_TxnRef)

	records.Set("vnp_BankCode", vnp_BankCode)
	records.Set("vnp_CardType", vnp_CardType)
	records.Set("vnp_OrderInfo", vnp_OrderInfo)
	records.Set("vnp_PayDate", vnp_PayDate)
	records.Set("vnp_ResponseCode", vnp_ResponseCode)
	records.Set("vnp_TmnCode", vnp_TmnCode)
	records.Set("vnp_TransactionNo", vnp_TransactionNo)
	records.Set("vnp_TransactionStatus", vnp_TransactionStatus)
	// records.Set("vnp_TxnRef",vnp_TxnRef)

	if err := app.Dao().SaveRecord(records); err != nil {
		return err
	}

	// fmt.Println("vnp_TxnRef = ", records.GetString("vnp_OrderInfo"))

	TxnRef := records.GetString("vnp_TxnRef")
	Amount := records.GetString("vnp_Amount")
	// paymentStatus := "0" // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN

	// checkOrderID := true // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
	// checkAmount := true  // Kiểm tra số tiền "giá trị của vnp_Amount/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn

	if secureHash == signed {
		if TxnRef == vnp_TxnRef {
			if Amount == vnp_Amount_Sort {
				if records.GetString("vnp_Status") == "0" { // Kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
					if vnp_ResponseCode == "00" {
						// Thành công
						// paymentStatus = '1'
						records.Set("vnp_Status", "1")
						if err := app.Dao().SaveRecord(records); err != nil {
							return err
						}

						// Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
						return c.JSON(http.StatusOK, map[string]interface{}{
							"RspCode": "00",
							"Message": "Success",
						})
					} else {
						// Thất bại
						// paymentStatus = '2'
						records.Set("vnp_Status", "2")
						if err := app.Dao().SaveRecord(records); err != nil {
							return err
						}

						// Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
						return c.JSON(http.StatusOK, map[string]interface{}{
							"RspCode": "00",
							"Message": "Success",
						})
					}
				} else {
					return c.JSON(http.StatusOK, map[string]interface{}{
						"RspCode": "02",
						"Message": "This order has been updated to the payment status",
					})
				}
			} else {
				return c.JSON(http.StatusOK, map[string]interface{}{
					"RspCode": "04",
					"Message": "Amount invalid",
				})
			}
		} else {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"RspCode": "01",
				"Message": "Order not found",
			})
		}
	} else {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"RspCode": "97",
			"Message": "Checksum failed",
		})
	}
}

// func encodeParams(params url.Values) string {
// 	var encodedParams []string
// 	for key, values := range params {
// 		for _, value := range values {
// 			encodedParams = append(encodedParams, fmt.Sprintf("%s=%s", key, value))
// 		}
// 	}
// 	return strings.Join(encodedParams, "&")
// }

// func generateSignature(data, secretKey string) string {
// 	h := hmac.New(sha512.New, []byte(secretKey))
// 	h.Write([]byte(data))
// 	signature := hex.EncodeToString(h.Sum(nil))
// 	return signature
// }
