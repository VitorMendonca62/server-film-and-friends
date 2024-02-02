// const mailOptions = {
//   from: "no.reply.movie.and.friends@gmail.com",
//   to: email,
//   subject: "Seu código de acesso para redefinir senha é...",
//   html: takeHTMLEmail(username, acessCode),
// };

// transporterEmail.sendMail(mailOptions, (err) => {
//   if (err) {
//     return res.status(400).json({
//       msg: "Algo deu errado!",
//       error: true,
//       data: err,
//     });
//   }
//   usersAcessCode[email] = acessCode;