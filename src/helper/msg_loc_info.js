const msg_info = (username,msg_txt) => {
  const info = {
    username:username,
    txt: msg_txt,

    createdAt: new Date().getTime(),
  };

  return info;
};

const loc_info = (username,loc_url) => {
  const info = {
    username:username,
    url: loc_url,
    createdAt: new Date().getTime(),
  };
  return info;
};

module.exports = { msg_info, loc_info };
