export const DeployTokenEmail = ({
  locale,
  data,
}: {
  locale: string;
  data: any;
}) => {
  if (locale == "vi-VN") {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Token Deploy Thành Công - Crypto Tools</title>
	<style>
		table,
		td,
		th {
			border-collapse: collapse;
		}

		div,
		a,
		b,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p,
		td,
		body,
		span {
			font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
		}

		a {
			text-decoration: none !important;
		}

		.success-icon {
			background-image: url(https://cdn.nobody.network/assets/0193a553-6a1c-4b95-95ba-cb66f4228f32/badge-check.png);
			height: 17px;
			width: 6px;
			float: left;
			background-repeat: no-repeat;
			padding-right: 10px;
			background-size: contain;
			margin-right: 6px;
		}

		.info-box {
			background: #1a1b1f;
			border: 1px solid #2d2e36;
			border-radius: 8px;
			padding: 16px;
			margin: 12px 0;
		}

		.token-info {
			background: #0f1012;
			border: 1px solid #17cdd8;
			border-radius: 8px;
			padding: 20px;
			margin: 16px 0;
		}

		.wallet-info {
			background: #0f1012;
			border: 1px solid #991b1b;
			border-radius: 8px;
			padding: 20px;
			margin: 16px 0;
		}

		@media (max-width: 600px) {
			.mobile-stack {
				display: block !important;
				width: 100% !important;
				padding-left: 0 !important;
				padding-right: 0 !important;
				text-align: center !important;
			}

			.mobile-center {
				text-align: center !important;
			}

			td {
				border-radius: 0 !important;
			}

			.container-mobile {
				padding: 0 !important;
				border-radius: 0 !important;
			}

			.header-image {
				padding: 24px 0 0 0
			}

			h2 {
				font-size: 17px !important
			}

			h1 {
				font-size: 22px !important
			}

			.container-mobile-header {
				border-radius: 8px !important;
				padding-bottom: 50px !important;
			}

			.mobile-button {
				display: block !important;
				width: calc(100% - 40px) !important;
				margin: 10px 20px !important;
				text-align: center !important;
				box-sizing: border-box !important;
			}
		}
	</style>
</head>
<body style="margin: 0; background-color: #f5f5f5;">
	<!-- Main Container Table -->
	<table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
		<tr>
			<td style="background: #3f3f4c; border-radius: 8px; padding: 50px 60px;"
				class="container-mobile container-mobile-header">

				<!-- Header Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td
							style="text-align: center; color: #fff; background-color: #121316; border-radius: 14px; margin-bottom: 20px;">
							<div style="padding: 24px;">
								<img
									src="https://cdn.nobody.network/assets/5c74bc70-c141-403f-86db-4825addc93c3/nobody-network-dark.jpg?height=120"
									alt="Nobody Network Logo" style="max-width: 180px; display: block; margin: 0 auto 20px;">
								<h1 style="margin: 14px 0 25px 0; font-size: 28px; font-weight: 600; line-height: normal; color: #fff;">
									🎉 Token Deploy Thành Công!</h1>
								<p style="font-size: 15px; line-height: 24px; margin: 0 0 15px; color: #fff;">
									Chúc mừng! Token của bạn đã được Crypto Tools deploy thành công. Dưới đây là tất cả thông tin quan trọng mà bạn cần lưu giữ cẩn thận.</p>
							</div>
						</td>
					</tr>
				</table>

				<!-- Spacing -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="height: 20px;"></td>
					</tr>
				</table>

				<!-- Token Information -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
								🪙 Thông Tin Token
							</h2>

							<div class="token-info">
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Tên token:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.token.name}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Ký hiệu:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.token.symbol}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Địa chỉ contract:</strong>
											<span style="color: #17cdd8; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data.token.address}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Tổng cung:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.token.totalSupply}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Số thập phân:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.token.decimals}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0; text-align: center;">
											<a href="https://a-scan.nobody.network/address/${data.token.address}" target="_blank"
											   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 16px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 15px 40px; text-decoration: none; display: inline-block; margin: 20px 0;">
												🔍 Xem trên explorer
											</a>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>
				</table>

				<!-- Spacing -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="height: 20px;"></td>
					</tr>
				</table>

				<!-- Wallet Information -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
								🔐 Thông Tin Ví Owner
							</h2>

							<div class="wallet-info">
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Địa chỉ ví owner:</strong>
											<span style="color: #991b1b; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data?.wallet?.address}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Sheed Phrase:</strong>
											<span style="color: #991b1b; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data?.wallet?.mnemonic}</span>
										</td>
									</tr>
								</table>
							</div>

							<div style="background: #1a1b1f; border: 1px solid #991b1b; border-radius: 8px; padding: 16px; margin-top: 16px;">
								<h4 style="color: #991b1b; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">⚠️ Lưu Ý Quan Trọng:</h4>
								<ul style="color: #9f9fa7; font-size: 14px; line-height: 20px; margin: 0; padding-left: 20px;">
									<li style="margin-bottom: 8px;">Lưu giữ cẩn thận Seed Phrase - đây là chìa khóa để truy cập ví</li>
									<li style="margin-bottom: 8px;">Không chia sẻ thông tin này với bất kỳ ai</li>
									<li style="margin-bottom: 8px;">Sao lưu thông tin vào nơi an toàn, có thể sử dụng ví cứng hoặc giấy</li>
									<li style="margin-bottom: 8px;">Ví này chứa toàn bộ token của bạn và cần thiết để thực hiện các giao dịch quản trị</li>
								</ul>
							</div>
						</td>
					</tr>
				</table>

				<!-- Spacing -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="height: 20px;"></td>
					</tr>
				</table>

				<!-- Quick Actions -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px; text-align: center;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0;">
								🚀 Hành Động Tiếp Theo
							</h2>

							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td width="50%" style="vertical-align: top; padding: 0 10px;" class="mobile-stack">
										<div style="background: #1a1b1f; border-radius: 8px; padding: 20px; height: 100%;">
											<h3 style="color: #17cdd8; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">📱 Kết Nối Ví</h3>
											<p style="color: #9f9fa7; font-size: 14px; line-height: 20px; margin: 0 0 16px 0;">
												Tải app Wallet Air để kết nối ví và quản lý token của bạn
											</p>
											<div style="text-align: center;">
												<a href="https://apps.apple.com/vn/app/wallet-air/id6744382526" target="_blank"
												   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 14px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 10px 20px; text-decoration: none; display: inline-block; margin-right: 10px;">
													🍎 App Store
												</a>
												<a href="https://play.google.com/store/apps/details?id=com.walletair.socjsc" target="_blank"
												   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 14px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 10px 20px; text-decoration: none; display: inline-block;">
													🤖 Play Store
												</a>
											</div>
										</div>
									</td>
									<td width="50%" style="vertical-align: top; padding: 0 10px;" class="mobile-stack mobile-spacing">
										<div style="background: #1a1b1f; border-radius: 8px; padding: 20px; height: 100%;">
											<h3 style="color: #17cdd8; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">🚀 Phát Triển Hệ Sinh Thái</h3>
											<p style="color: #9f9fa7; font-size: 14px; line-height: 20px; margin: 0 0 16px 0;">
												Liên hệ với đội ngũ lập trình viên của Nobody để được tư vấn thêm
											</p>
											<div style="text-align: center;">
												<a href="https://www.nobody.network" target="_blank"
												   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 14px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 10px 20px; text-decoration: none; display: inline-block;">
													🌐 Truy cập website
												</a>
											</div>
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>

				<!-- Spacing -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="height: 20px;"></td>
					</tr>
				</table>

				<!-- Support Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px; text-align: center;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0;">
								💬 Cần Hỗ Trợ?
							</h2>
							<p style="color: #9f9fa7; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
								Tham gia Nobody Network để kết nối cùng cộng đồng công nghệ năng động, nơi bạn luôn nhận được sự hỗ trợ và chia sẻ kiến thức về blockchain và AI.
							</p>
							<div style="text-align: center;">
								<a href="https://join.chat.socjsc.com/#/#global:nobody.network" target="_blank"
								   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 14px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 10px 20px; text-decoration: none; display: inline-block;">
									💬 Nhóm Chat Global
								</a>
							</div>
						</td>
					</tr>
				</table>

				<!-- Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #ffffff!important; font-size: 14px; text-align: center; padding: 20px;">
							Email này được phát lệnh gửi từ <a href="https://tools.nobody.network" target="_blank" style="color: #17cdd8;">Crypto Tools</a><br><br>
							Để được hỗ trợ, vui lòng liên hệ <a href="mailto:zero@nobody.network" style="color: #17cdd8;">zero@nobody.network</a>
						</td>
					</tr>
				</table>

				<!-- Footer Links -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="border-top: 1px solid #4e4e52; padding: 10px 20px; text-align: center; margin: 0 20px;">
							<a href="https://www.nobody.network" target="_blank"
								style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Truy cập
								nobody.network</a>
							<span style="color: #91919a; ">|</span>
							<a href="/unsubscribe" style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Hủy
								đăng ký</a>
						</td>
					</tr>
				</table>

				<!-- Final Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #fff; text-align: center; font-size: 14px;">
							Email này được gửi bởi Nobody Network.
						</td>
					</tr>
				</table>

			</td>
		</tr>
	</table>
</body>
</html>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Token Deployment Successful - Crypto Tools</title>
	<style>
		table,
		td,
		th {
			border-collapse: collapse;
		}

		div,
		a,
		b,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p,
		td,
		body,
		span {
			font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
		}

		a {
			text-decoration: none !important;
		}

		.success-icon {
			background-image: url(https://cdn.nobody.network/assets/0193a553-6a1c-4b95-95ba-cb66f4228f32/badge-check.png);
			height: 17px;
			width: 6px;
			float: left;
			background-repeat: no-repeat;
			padding-right: 10px;
			background-size: contain;
			margin-right: 6px;
		}

		.info-box {
			background: #1a1b1f;
			border: 1px solid #2d2e36;
			border-radius: 8px;
			padding: 16px;
			margin: 12px 0;
		}

		.token-info {
			background: #0f1012;
			border: 1px solid #17cdd8;
			border-radius: 8px;
			padding: 20px;
			margin: 16px 0;
		}

		.wallet-info {
			background: #0f1012;
			border: 1px solid #991b1b;
			border-radius: 8px;
			padding: 20px;
			margin: 16px 0;
		}

		@media (max-width: 600px) {
			.mobile-stack {
				display: block !important;
				width: 100% !important;
				padding-left: 0 !important;
				padding-right: 0 !important;
				text-align: center !important;
			}

			.mobile-center {
				text-align: center !important;
			}

			td {
				border-radius: 0 !important;
			}

			.container-mobile {
				padding: 0 !important;
				border-radius: 0 !important;
			}

			.header-image {
				padding: 24px 0 0 0
			}

			h2 {
				font-size: 17px !important
			}

			h1 {
				font-size: 22px !important
			}

			.container-mobile-header {
				border-radius: 8px !important;
				padding-bottom: 50px !important;
			}

			.mobile-button {
				display: block !important;
				width: calc(100% - 40px) !important;
				margin: 10px 20px !important;
				text-align: center !important;
				box-sizing: border-box !important;
			}
		}
	</style>
</head>
<body style="margin: 0; background-color: #f5f5f5;">
	<!-- Main Container Table -->
	<table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
		<tr>
			<td style="background: #3f3f4c; border-radius: 8px; padding: 50px 60px;"
				class="container-mobile container-mobile-header">

				<!-- Header Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td
							style="text-align: center; color: #fff; background-color: #121316; border-radius: 14px; margin-bottom: 20px;">
							<div style="padding: 24px;">
								<img
									src="https://cdn.nobody.network/assets/5c74bc70-c141-403f-86db-4825addc93c3/nobody-network-dark.jpg?height=120"
									alt="Nobody Network Logo" style="max-width: 180px; display: block; margin: 0 auto 20px;">
								<h1 style="margin: 14px 0 25px 0; font-size: 28px; font-weight: 600; line-height: normal; color: #fff;">
									🎉 Token Deployment Successful!</h1>
								<p style="font-size: 15px; line-height: 24px; margin: 0 0 15px; color: #fff;">
									Congratulations! Your token has been successfully deployed using Crypto Tools. Below is all the important information you need to keep safe.</p>
							</div>
						</td>
					</tr>
				</table>

				<!-- Token Information -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
								🪙 Token Information
							</h2>

							<div class="token-info">
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Token Name:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.token.name}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Symbol:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.token.symbol}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Contract Address:</strong>
											<span style="color: #17cdd8; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data.token.address}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Total Supply:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.token.totalSupply}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Decimals:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.token.decimals}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0; text-align: center;">
											<a href="https://a-scan.nobody.network/address/${data.token.address}" target="_blank"
											   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 16px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 15px 40px; text-decoration: none; display: inline-block; margin: 20px 0;">
												🔍 View on Explorer
											</a>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>
				</table>

				<!-- Wallet Information -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
								🔐 Owner Wallet Information
							</h2>

							<div class="wallet-info">
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Owner Wallet Address:</strong>
											<span style="color: #991b1b; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data?.wallet?.address}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Seed Phrase:</strong>
											<span style="color: #991b1b; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data?.wallet?.mnemonic}</span>
										</td>
									</tr>
								</table>
							</div>

							<div style="background: #1a1b1f; border: 1px solid #991b1b; border-radius: 8px; padding: 16px; margin-top: 16px;">
								<h4 style="color: #991b1b; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">⚠️ Important Notice:</h4>
								<ul style="color: #9f9fa7; font-size: 14px; line-height: 20px; margin: 0; padding-left: 20px;">
									<li style="margin-bottom: 8px;">Keep your Seed Phrase secure – this is the key to accessing your wallet</li>
									<li style="margin-bottom: 8px;">Do not share this information with anyone</li>
									<li style="margin-bottom: 8px;">Back up the information in a safe place, such as a hardware wallet or paper</li>
									<li style="margin-bottom: 8px;">This wallet contains all of your tokens and is required for governance transactions</li>
								</ul>
							</div>
						</td>
					</tr>
				</table>

				<!-- Quick Actions -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px; text-align: center;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0;">
								🚀 Next Steps
							</h2>

							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td width="50%" style="vertical-align: top; padding: 0 10px;" class="mobile-stack">
										<div style="background: #1a1b1f; border-radius: 8px; padding: 20px; height: 100%;">
											<h3 style="color: #17cdd8; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">📱 Connect Wallet</h3>
											<p style="color: #9f9fa7; font-size: 14px; line-height: 20px; margin: 0 0 16px 0;">
												Download the Wallet Air app to connect and manage your tokens
											</p>
											<div style="text-align: center;">
												<a href="https://apps.apple.com/vn/app/wallet-air/id6744382526" target="_blank"
												   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 14px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 10px 20px; text-decoration: none; display: inline-block; margin-right: 10px;">
													🍎 App Store
												</a>
												<a href="https://play.google.com/store/apps/details?id=com.walletair.socjsc" target="_blank"
												   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 14px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 10px 20px; text-decoration: none; display: inline-block;">
													🤖 Play Store
												</a>
											</div>
										</div>
									</td>
									<td width="50%" style="vertical-align: top; padding: 0 10px;" class="mobile-stack mobile-spacing">
										<div style="background: #1a1b1f; border-radius: 8px; padding: 20px; height: 100%;">
											<h3 style="color: #17cdd8; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">🚀 Expand Ecosystem</h3>
											<p style="color: #9f9fa7; font-size: 14px; line-height: 20px; margin: 0 0 16px 0;">
												Contact the Nobody developer team for further consultation
											</p>
											<div style="text-align: center;">
												<a href="https://www.nobody.network" target="_blank"
												   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 14px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 10px 20px; text-decoration: none; display: inline-block;">
													🌐 Visit Website
												</a>
											</div>
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>

				<!-- Support Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px; text-align: center;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0;">
								💬 Need Support?
							</h2>
							<p style="color: #9f9fa7; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
								Join Nobody Network to connect with a dynamic tech community, where you always receive support and share knowledge about blockchain and AI.
							</p>
							<div style="text-align: center;">
								<a href="https://join.chat.socjsc.com/#/#global:nobody.network" target="_blank"
								   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 14px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 10px 20px; text-decoration: none; display: inline-block;">
									💬 Global Chat Group
								</a>
							</div>
						</td>
					</tr>
				</table>

				<!-- Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #ffffff!important; font-size: 14px; text-align: center; padding: 20px;">
							This email was triggered by <a href="https://tools.nobody.network" target="_blank" style="color: #17cdd8;">Crypto Tools</a><br><br>
							For support, please contact <a href="mailto:zero@nobody.network" style="color: #17cdd8;">zero@nobody.network</a>
						</td>
					</tr>
				</table>

				<!-- Footer Links -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="border-top: 1px solid #4e4e52; padding: 10px 20px; text-align: center; margin: 0 20px;">
							<a href="https://www.nobody.network" target="_blank"
								style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Visit nobody.network</a>
							<span style="color
`;
};

export const ChainBuilderEmail = ({
  locale,
  data,
}: {
  locale: string;
  data: any;
}) => {
	console.log(data);
  return `<!DOCTYPE html>
<html lang="vi">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Chain Builder Request - Crypto Tools</title>
	<style>
		table,
		td,
		th {
			border-collapse: collapse;
		}

		div,
		a,
		b,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p,
		td,
		body,
		span {
			font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
		}

		a {
			text-decoration: none !important;
		}

		.success-icon {
			background-image: url(https://cdn.nobody.network/assets/0193a553-6a1c-4b95-95ba-cb66f4228f32/badge-check.png);
			height: 17px;
			width: 6px;
			float: left;
			background-repeat: no-repeat;
			padding-right: 10px;
			background-size: contain;
			margin-right: 6px;
		}

		.info-box {
			background: #1a1b1f;
			border: 1px solid #2d2e36;
			border-radius: 8px;
			padding: 16px;
			margin: 12px 0;
		}

		.token-info {
			background: #0f1012;
			border: 1px solid #17cdd8;
			border-radius: 8px;
			padding: 20px;
			margin: 16px 0;
		}

		.wallet-info {
			background: #0f1012;
			border: 1px solid #991b1b;
			border-radius: 8px;
			padding: 20px;
			margin: 16px 0;
		}

		@media (max-width: 600px) {
			.mobile-stack {
				display: block !important;
				width: 100% !important;
				padding-left: 0 !important;
				padding-right: 0 !important;
				text-align: center !important;
			}

			.mobile-center {
				text-align: center !important;
			}

			td {
				border-radius: 0 !important;
			}

			.container-mobile {
				padding: 0 !important;
				border-radius: 0 !important;
			}

			.header-image {
				padding: 24px 0 0 0
			}

			h2 {
				font-size: 17px !important
			}

			h1 {
				font-size: 22px !important
			}

			.container-mobile-header {
				border-radius: 8px !important;
				padding-bottom: 50px !important;
			}

			.mobile-button {
				display: block !important;
				width: calc(100% - 40px) !important;
				margin: 10px 20px !important;
				text-align: center !important;
				box-sizing: border-box !important;
			}
		}
	</style>
</head>
<body style="margin: 0; background-color: #f5f5f5;">
	<!-- Main Container Table -->
	<table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
		<tr>
			<td style="background: #3f3f4c; border-radius: 8px; padding: 50px 60px;"
				class="container-mobile container-mobile-header">

				<!-- Header Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td
							style="text-align: center; color: #fff; background-color: #121316; border-radius: 14px; margin-bottom: 20px;">
							<div style="padding: 24px;">
								<img
									src="https://cdn.nobody.network/assets/5c74bc70-c141-403f-86db-4825addc93c3/nobody-network-dark.jpg?height=120"
									alt="Nobody Network Logo" style="max-width: 180px; display: block; margin: 0 auto 20px;">
								<h1 style="margin: 14px 0 25px 0; font-size: 28px; font-weight: 600; line-height: normal; color: #fff;">
									Yêu Cầu Xây Dựng Blockchain!</h1>
								<p style="font-size: 15px; line-height: 24px; margin: 0 0 15px; color: #fff;">
								  Một yêu cầu xây dựng blockchain đã được tạo. Dưới đây là các thông tin chi tiết. 
								</p>
							</div>
						</td>
					</tr>
				</table>

				<!-- Spacing -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="height: 20px;"></td>
					</tr>
				</table>

				<!-- Token Information -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
								🪩 Thông Tin Chain
							</h2>

							<div class="token-info">
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">ID Chain:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.chainId}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Name:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.chainName}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Symbol:</strong>
											<span style="color: #17cdd8; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data.symbol}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">RPC URL:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.rpcUrl}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Explorer Domain:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.explorerDomain}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Email request:</strong>
											<span style="color: #17cdd8; margin-left: 8px;">${data.email}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Icon:</strong>
											<a  href="${process.env.NEXT_PUBLIC_API_URL}/assets/${data?.icon}" target="_blank" style="color: #17cdd8; margin-left: 8px;">${data?.icon}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Logo:</strong>
											<a href="${process.env.NEXT_PUBLIC_API_URL}/assets/${data?.logo}" target="_blank" style="color: #17cdd8; margin-left: 8px;">${data?.logo}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Open Grap Image:</strong>
											<a  href="${process.env.NEXT_PUBLIC_API_URL}/assets/${data?.openGraph}" target="_blank" style="color: #17cdd8; margin-left: 8px;">${data?.openGraph}</span>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>
				</table>

				<!-- Spacing -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="height: 20px;"></td>
					</tr>
				</table>

				<!-- Wallet Information -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background: #121316; border-radius: 15px; padding: 25px;">
							<h2 style="color: #fff; font-size: 22px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
								🔐 Thông Tin Giao Dịch
							</h2>

							<div class="wallet-info">
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Chain ID:</strong>
											<span style="color: #991b1b; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data?.chainPay}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Wallet Address:</strong>
											<span style="color: #991b1b; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data?.wallet}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0;">
											<strong style="color: #fff; font-weight: 600;">Amount:</strong>
											<span style="color: #991b1b; margin-left: 8px; font-family: 'Courier New', monospace; font-size: 13px; word-break: break-all;">${data?.amount}</span>
										</td>
									</tr>
									<tr>
										<td style="color: #9f9fa7; font-size: 14px; line-height: 20px; padding: 8px 0; text-align: center;">
											<a href="${data?.hash}" target="_blank"
											   style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 16px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 15px 40px; text-decoration: none; display: inline-block; margin: 20px 0;">
												🔍 Xem trên explorer
											</a>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>
				</table>

				<!-- Spacing -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="height: 20px;"></td>
					</tr>
				</table>

				<!-- Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #ffffff!important; font-size: 14px; text-align: center; padding: 20px;">
							Email này được phát lệnh gửi từ <a href="https://tools.nobody.network" target="_blank" style="color: #17cdd8;">Crypto Tools</a><br><br>
							Để được hỗ trợ, vui lòng liên hệ <a href="mailto:zero@nobody.network" style="color: #17cdd8;">zero@nobody.network</a>
						</td>
					</tr>
				</table>

				<!-- Footer Links -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="border-top: 1px solid #4e4e52; padding: 10px 20px; text-align: center; margin: 0 20px;">
							<a href="https://www.nobody.network" target="_blank"
								style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Truy cập
								nobody.network</a>
							<span style="color: #91919a; ">|</span>
							<a href="/unsubscribe" style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Hủy
								đăng ký</a>
						</td>
					</tr>
				</table>

				<!-- Final Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #fff; text-align: center; font-size: 14px;">
							Email này được gửi bởi Nobody Network.
						</td>
					</tr>
				</table>

			</td>
		</tr>
	</table>
</body>
</html>`;
};
