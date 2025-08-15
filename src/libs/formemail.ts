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
    <title>Token Deploy Thành Công</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                                🎉 Token Deploy Thành Công!
                            </h1>
                            <p style="color: #e8f0fe; margin: 10px 0 0 0; font-size: 16px;">
                                Token của bạn đã được triển khai thành công trên blockchain
                            </p>
                        </td>
                    </tr>

                    <!-- Success Message -->
                    <tr>
                        <td style="padding: 30px;">
                            <!-- Wallet Information -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                    🔐 Thông Tin Ví Gốc
                                </h2>
                                
                                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                                        ⚠️ QUAN TRỌNG: Vui lòng lưu trữ thông tin này ở nơi an toàn và không chia sẻ với bất kỳ ai!
                                    </p>
                                </div>

                                <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px;">
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; width: 150px; border-bottom: 1px solid #e5e7eb;">Địa chỉ ví:</td>
                                        <td style="color: #1f2937; font-family: monospace; font-size: 14px; word-break: break-all; border-bottom: 1px solid #e5e7eb;">
                                            ${data.wallet.address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Private Key:</td>
                                        <td style="color: #dc2626; font-family: monospace; font-size: 14px; word-break: break-all; border-bottom: 1px solid #e5e7eb;">
                                        ${data.wallet.privateKey}
                                        </td>
                                    </tr>
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Seed Phrase:</td>
                                        <td style="color: #dc2626; font-family: monospace; font-size: 14px; word-break: break-all; border-bottom: 1px solid #e5e7eb;">
                                        ${data.wallet.mnemonic}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151;">Public Key:</td>
                                        <td style="color: #1f2937; font-family: monospace; font-size: 14px; word-break: break-all;">
                                        ${data.wallet.publicKey}
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Token Information -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                    🪙 Thông Tin Token
                                </h2>
                                
                                <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px;">
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; width: 150px; border-bottom: 1px solid #e5e7eb;">Tên Token:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.token.name}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Symbol:</td>
                                        <td style="color: #1f2937; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${data.token.symbol}</td>
                                    </tr>
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Địa chỉ Token:</td>
                                        <td style="color: #1f2937; font-family: monospace; font-size: 14px; word-break: break-all; border-bottom: 1px solid #e5e7eb;">
                                        ${data.token.address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Decimals:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.token.decimals}</td>
                                    </tr>
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Total Supply:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.token.totalSupply}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Network:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.chain.chain_id.name}</td>
                                    </tr>
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; width: 150px; border-bottom: 1px solid #e5e7eb;">Xác thực:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.token.verificationStatus}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Transaction Link -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                    🔗 Giao Dịch Deploy
                                </h2>
                                
                                <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; text-align: center;">
                                    <p style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 16px;">
                                        Xem chi tiết giao dịch deploy token của bạn:
                                    </p>
                                    <a href="${data.chain.chain_id.explorer_url}/tx/${data.initialTransaction}" 
                                       style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                        📊 Xem trên Etherscan
                                    </a>
                                    <p style="margin: 15px 0 0 0; color: #64748b; font-size: 12px; font-family: monospace; word-break: break-all;">
                                        TX Hash: ${data.initialTransaction}
                                    </p>
                                </div>
                            </div>

                            <!-- Next Steps -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                    📋 Các Bước Tiếp Theo
                                </h2>
                                
                                <ul style="color: #374151; line-height: 1.6; padding-left: 20px;">
                                    <li style="margin-bottom: 8px;">Lưu trữ thông tin ví và private key ở nơi an toàn</li>
                                    <li style="margin-bottom: 8px;">Thêm token vào ví MetaMask hoặc ví khác bằng địa chỉ contract</li>
                                    <li style="margin-bottom: 8px;">Kiểm tra token trên các block explorer</li>
                                    <li style="margin-bottom: 8px;">Cân nhắc verify contract source code nếu cần thiết</li>
                                    <li>Bắt đầu phân phối token theo kế hoạch của bạn</li>
                                </ul>
                            </div>

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
    <title>Token Deployment Successful</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                                🎉 Token Deployment Successful!
                            </h1>
                            <p style="color: #e8f0fe; margin: 10px 0 0 0; font-size: 16px;">
                                Your token has been successfully deployed on the blockchain
                            </p>
                        </td>
                    </tr>

                    <!-- Success Message -->
                    <tr>
                        <td style="padding: 30px;">
                            <!-- Wallet Information -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                    🔐 Original Wallet Information
                                </h2>
                                
                                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                                        ⚠️ IMPORTANT: Please store this information in a safe place and do not share it with anyone!
                                    </p>
                                </div>

                                <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px;">
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; width: 150px; border-bottom: 1px solid #e5e7eb;">Wallet Address:</td>
                                        <td style="color: #1f2937; font-family: monospace; font-size: 14px; word-break: break-all; border-bottom: 1px solid #e5e7eb;">
                                        ${data.wallet.address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Private Key:</td>
                                        <td style="color: #dc2626; font-family: monospace; font-size: 14px; word-break: break-all; border-bottom: 1px solid #e5e7eb;">
                                        ${data.wallet.privateKey}
                                        </td>
                                    </tr>
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Seed Phrase:</td>
                                        <td style="color: #dc2626; font-family: monospace; font-size: 14px; word-break: break-all; border-bottom: 1px solid #e5e7eb;">
                                        ${data.wallet.mnemonic}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151;">Public Key:</td>
                                        <td style="color: #1f2937; font-family: monospace; font-size: 14px; word-break: break-all;">
                                        ${data.wallet.publicKey}
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Token Information -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                    🪙 Token Information
                                </h2>
                                
                                <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px;">
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; width: 150px; border-bottom: 1px solid #e5e7eb;">Token Name:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.token.name}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Symbol:</td>
                                        <td style="color: #1f2937; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${data.token.symbol}</td>
                                    </tr>
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Token Address:</td>
                                        <td style="color: #1f2937; font-family: monospace; font-size: 14px; word-break: break-all; border-bottom: 1px solid #e5e7eb;">
                                        ${data.token.address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Decimals:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.token.decimals}</td>
                                    </tr>
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Total Supply:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.token.totalSupply}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Network:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.chain.chain_id.name}</td>
                                    </tr>
                                    <tr style="background-color: #f9fafb;">
                                        <td style="font-weight: 600; color: #374151; width: 150px; border-bottom: 1px solid #e5e7eb;">Verify:</td>
                                        <td style="color: #1f2937; border-bottom: 1px solid #e5e7eb;">${data.token.verificationStatus}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Transaction Link -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                    🔗 Deployment Transaction
                                </h2>
                                
                                <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; text-align: center;">
                                    <p style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 16px;">
                                        View the details of your token deployment transaction:
                                    </p>
                                    <a href="${data.chain.chain_id.explorer_url}/tx/${data.initialTransaction}" 
                                       style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                        📊 View on Etherscan
                                    </a>
                                    <p style="margin: 15px 0 0 0; color: #64748b; font-size: 12px; font-family: monospace; word-break: break-all;">
                                        TX Hash: ${data.initialTransaction}
                                    </p>
                                </div>
                            </div>

                            <!-- Next Steps -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                    📋 Next Steps
                                </h2>
                                
                                <ul style="color: #374151; line-height: 1.6; padding-left: 20px;">
                                    <li style="margin-bottom: 8px;">Store wallet information and private key in a secure location</li>
                                    <li style="margin-bottom: 8px;">Add the token to MetaMask or other wallets using the contract address</li>
                                    <li style="margin-bottom: 8px;">Check the token on block explorers</li>
                                    <li style="margin-bottom: 8px;">Consider verifying the contract source code if needed</li>
                                    <li>Start distributing the token according to your plan</li>
                                </ul>
                            </div>

                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};
