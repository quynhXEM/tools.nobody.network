export const DeployTokenEmail = ({
  locale,
  data,
}: {
  locale: string;
  data: any;
}) => {
  if (locale == "vi-VN") {
    return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
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

			.mobile-button {
				display: block !important;
				width: calc(100% - 40px) !important;
				margin: 10px 20px !important;
				text-align: center !important;
				box-sizing: border-box !important;
			}
		}

		.copy-btn {
			background-color: #17cdd8;
			color: #fff;
			border: none;
			padding: 4px 8px;
			border-radius: 4px;
			font-size: 11px;
			cursor: pointer;
			margin-left: 8px;
			transition: background-color 0.2s;
		}

		.copy-btn:hover {
			background-color: #14b5c4;
		}

		.truncated-text {
			font-family: monospace;
			font-size: 12px;
			color: #ccc;
			display: inline-block;
			max-width: 200px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			vertical-align: middle;
		}
	</style>
</head>
<body>
<div style="margin: 0; background-color: #f5f5f5;">
	<table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
		<tr>
			<td style="background: #3f3f4c; border-radius: 8px; padding: 50px 60px;"
				class="container-mobile container-mobile-header">

				<!-- Header -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="text-align: center; color: #fff; background-color: #121316; border-radius: 14px; margin-bottom: 20px;">
							<div style="padding: 24px;">
								<img src="https://cdn.nobody.network/assets/5c74bc70-c141-403f-86db-4825addc93c3/nobody-network-dark.jpg?height=120"
									alt="Nobody Network Logo" style="max-width: 180px; display: block; margin: 0 auto 20px;">
								<h1 style="margin: 14px 0 25px 0; font-size: 28px; font-weight: 600; line-height: normal; color: #fff;">
									Thông tin Token của bạn</h1>
								<p style="font-size: 16px; line-height: 24px; margin: 0 0 15px; color: #fff;">
									Cảm ơn bạn đã sử dụng công cụ của chúng tôi.</p>
							</div>
						</td>
					</tr>
				</table>

				<!-- Token Information -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="background-color: #2a2a35; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
							<h2 style="color: #17cdd8; font-size: 20px; margin: 0 0 15px 0; text-align: center;">Thông tin Token</h2>
							<table width="100%" cellpadding="0" cellspacing="0" style="color: #fff;">
								<tr>
									<td style="padding: 8px 0; font-weight: 600; width: 30%;">Địa chỉ:</td>
									<td style="padding: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px;">${data?.token?.address}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Tên:</td>
									<td style="padding: 8px 0;">${data?.token?.name}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Ký hiệu:</td>
									<td style="padding: 8px 0;">${data?.token?.symbol}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Số thập phân:</td>
									<td style="padding: 8px 0;">${data?.token?.decimals}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Tổng cung:</td>
									<td style="padding: 8px 0;">${data?.token?.totalSupply}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Mã nguồn:</td>
									<td style="padding: 8px 0;">${data?.token?.sourceCode}</td>
								</tr>
							</table>
						</td>
					</tr>
					
					<!-- Wallet Information -->
					<tr>
						<td style="background-color: #2a2a35; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
							<h2 style="color: #17cdd8; font-size: 20px; margin: 0 0 15px 0; text-align: center;">Thông tin Ví</h2>
							<table width="100%" cellpadding="0" cellspacing="0" style="color: #fff;">
								<tr>
									<td style="padding: 8px 0; font-weight: 600; width: 30%;">Địa chỉ:</td>
									<td style="padding: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px;">${data?.wallet?.address}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Private Key:</td>
									<td style="padding: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px; color: #ff9999;">
										<span style="background-color: #4a1a1a; padding: 4px; border-radius: 4px; display: inline-block;">
											${data?.wallet?.privateKey}
										</span>
									</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Mnemonic:</td>
									<td style="padding: 8px 0; font-family: monospace; font-size: 12px; color: #ffcc99;">
										<span style="background-color: #4a3a1a; padding: 4px; border-radius: 4px; display: inline-block;">
                                        ${data?.wallet?.mnemonic}
										</span>
									</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Public Key:</td>
									<td style="padding: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px;">${data?.wallet?.publicKey}</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>

				<!-- Footer -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #ffffff!important; font-size: 14px; text-align: center; padding: 20px;">
							Email này cung cấp cho bạn thông tin token và ví gốc của hợp đồng thông minh mà bạn vừa triển khai. Vui lòng lưu trữ thông tin này và giữ an toàn, vì chúng tôi sẽ không cung cấp lại.<br><br>
							Hỗ trợ, vui lòng liên hệ: <a href="mailto:zero@nobody.network" style="color: #17cdd8;">zero@nobody.network</a>
						</td>
					</tr>
				</table>

				<!-- Footer Links -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="border-top: 1px solid #4e4e52; padding: 10px 20px; text-align: center; margin: 0 20px;">
							<a href="https://www.nobody.network" target="_blank"
								style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Truy cập nobody.network</a>
							<span style="color: #91919a; ">|</span>
							<a href="/unsubscribe" style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Hủy đăng ký</a>
						</td>
					</tr>
				</table>

				<!-- Final Footer -->
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
</div>

<script>
function copyToClipboard(text) {
	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(text).then(function() {
			const btn = event.target;
			const originalText = btn.textContent;
			btn.textContent = 'Đã sao chép!';
			btn.style.backgroundColor = '#28a745';
			setTimeout(function() {
				btn.textContent = originalText;
				btn.style.backgroundColor = '#17cdd8';
			}, 2000);
		}).catch(function(err) {
			console.error('Không thể sao chép: ', err);
		});
	} else {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand('copy');
			const btn = event.target;
			const originalText = btn.textContent;
			btn.textContent = 'Đã sao chép!';
			btn.style.backgroundColor = '#28a745';
			setTimeout(function() {
				btn.textContent = originalText;
				btn.style.backgroundColor = '#17cdd8';
			}, 2000);
		} catch (err) {
			console.error('Không thể sao chép: ', err);
		}
		document.body.removeChild(textArea);
	}
}
</script>

</body>
</html>
`;
  }

  return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
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

			.mobile-button {
				display: block !important;
				width: calc(100% - 40px) !important;
				margin: 10px 20px !important;
				text-align: center !important;
				box-sizing: border-box !important;
			}
		}

		/* Added styles for copy button and truncated text */
		.copy-btn {
			background-color: #17cdd8;
			color: #fff;
			border: none;
			padding: 4px 8px;
			border-radius: 4px;
			font-size: 11px;
			cursor: pointer;
			margin-left: 8px;
			transition: background-color 0.2s;
		}

		.copy-btn:hover {
			background-color: #14b5c4;
		}

		.truncated-text {
			font-family: monospace;
			font-size: 12px;
			color: #ccc;
			display: inline-block;
			max-width: 200px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			vertical-align: middle;
		}
	</style>
</head>
<body>
<div style="margin: 0; background-color: #f5f5f5;">
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
									Your Token Infomation</h1>
								<p style="font-size: 16px; line-height: 24px; margin: 0 0 15px; color: #fff;">
									Thank you for using our tools.</p>
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

				<!-- Verification Button Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<!-- Added token information section -->
					<tr>
						<td style="background-color: #2a2a35; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
							<h2 style="color: #17cdd8; font-size: 20px; margin: 0 0 15px 0; text-align: center;">Token Information</h2>
							<table width="100%" cellpadding="0" cellspacing="0" style="color: #fff;">
								<tr>
									<td style="padding: 8px 0; font-weight: 600; width: 30%;">Address:</td>
									<td style="padding: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px;">${data?.token?.address}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Name:</td>
									<td style="padding: 8px 0;">${data?.token?.name}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Symbol:</td>
									<td style="padding: 8px 0;">${data?.token?.symbol}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Decimals:</td>
									<td style="padding: 8px 0;">${data?.token?.decimals}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Total Supply:</td>
									<td style="padding: 8px 0;">${data?.token?.totalSupply}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600;">Source:</td>
									<td style="padding: 8px 0;">${data?.token?.sourceCode}</td>
								</tr>
							</table>
						</td>
					</tr>
					
					<!-- Spacing -->
					<tr>
						<td style="height: 20px;"></td>
					</tr>
					
					<!-- Added wallet information section -->
					<tr>
						<td style="background-color: #2a2a35; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
							<h2 style="color: #17cdd8; font-size: 20px; margin: 0 0 15px 0; text-align: center;">Wallet Information</h2>
							<table width="100%" cellpadding="0" cellspacing="0" style="color: #fff;">
								<tr>
									<td style="padding: 8px 0; font-weight: 600; width: 30%;">Address:</td>
									<td style="padding: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px;">${data?.wallet?.address}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Private Key:</td>
									<td style="padding: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px; color: #ff9999;">
										<span style="background-color: #4a1a1a; padding: 4px; border-radius: 4px; display: inline-block;">
											${data?.wallet?.privateKey}
										</span>
									</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Mnemonic:</td>
									<td style="padding: 8px 0; font-family: monospace; font-size: 12px; color: #ffcc99;">
										<span style="background-color: #4a3a1a; padding: 4px; border-radius: 4px; display: inline-block;">
                                        ${data?.wallet?.mnemonic}
										</span>
									</td>
								</tr>
								<tr>
									<td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Public Key:</td>
									<td style="padding: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px;">${data?.wallet?.publicKey}</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>

				<!-- Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #ffffff!important; font-size: 14px; text-align: center; padding: 20px;">
							This email provides you with the token information and the original wallet of the smart contract you have just deployed. Please save this information and keep it secure, as we will not provide it again.<br><br>
							For support, please contact: <a href="mailto:zero@nobody.network" style="color: #17cdd8;">zero@nobody.network</a>
						</td>
					</tr>
				</table>

				<!-- Footer Links -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="border-top: 1px solid #4e4e52; padding: 10px 20px; text-align: center; margin: 0 20px;">
							<a href="https://www.nobody.network" target="_blank"
								style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Visit nobody.network</a>
							<span style="color: #91919a; ">|</span>
							<a href="/unsubscribe" style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
						</td>
					</tr>
				</table>

				<!-- Final Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #fff; text-align: center; font-size: 14px;">
							This email was sent by Nobody Network.
						</td>
					</tr>
				</table>

			</td>
		</tr>
	</table>
</div>

<script>
function copyToClipboard(text) {
	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(text).then(function() {
			// Show success feedback
			const btn = event.target;
			const originalText = btn.textContent;
			btn.textContent = 'Copied!';
			btn.style.backgroundColor = '#28a745';
			setTimeout(function() {
				btn.textContent = originalText;
				btn.style.backgroundColor = '#17cdd8';
			}, 2000);
		}).catch(function(err) {
			console.error('Failed to copy: ', err);
		});
	} else {
		// Fallback for older browsers
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand('copy');
			const btn = event.target;
			const originalText = btn.textContent;
			btn.textContent = 'Copied!';
			btn.style.backgroundColor = '#28a745';
			setTimeout(function() {
				btn.textContent = originalText;
				btn.style.backgroundColor = '#17cdd8';
			}, 2000);
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
		document.body.removeChild(textArea);
	}
}
</script>

</body>
</html>`;
};