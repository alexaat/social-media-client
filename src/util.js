import { serverHost } from "./constants.js";


export const buildImageUrl = (fileName) => {
  return `${serverHost}/image?id=${fileName}`;
};

export const dateConverter = (date) => {
  const converted = convert(date);

  if (converted.charAt(0) == "-") {
    return formatMilli(date);
  }

  return `${converted} ago`;
};

const convert = (date) => {
  // To calculate the time difference of two dates
  const difference_in_time = Date.now() - parseInt(date);

  let difference_in_seconds = Math.trunc(difference_in_time / 1000);
  if (difference_in_seconds === 1) return "1 sec";
  if (difference_in_seconds < 60) return `${difference_in_seconds} secs`;

  let difference_in_minutes = Math.trunc(difference_in_time / (1000 * 60));
  if (difference_in_minutes === 1) return "1 min";
  if (difference_in_minutes < 60) return `${difference_in_minutes} mins`;

  let difference_in_hours = Math.trunc(difference_in_time / (1000 * 3600));
  if (difference_in_hours === 1) return "1 h";
  if (difference_in_hours < 24) return `${difference_in_hours} hs`;

  let difference_in_days = Math.trunc(difference_in_time / (1000 * 3600 * 24));
  if (difference_in_days === 1) return `1 day`;
  if (difference_in_days < 30) return `${difference_in_days} days`;

  let difference_in_months = Math.trunc(
    difference_in_time / (1000 * 3600 * 24 * 30)
  );
  if (difference_in_months === 1) return `1 month`;
  if (difference_in_months < 12) return `${difference_in_months} months`;

  let difference_in_years = Math.trunc(
    difference_in_time / (1000 * 3600 * 24 * 365)
  );
  if (difference_in_years === 1) return `1 year`;
  return `${difference_in_years} years`;
};

export const formatMilli = (milli) => {
  return new Date(milli).toUTCString().slice(0, -3);
};

export const transformMessages = (chats, userId) => {
  const lastMessagesFiltered = [];
  for (let i = 0; i < chats.length; i++) {
    let isDublicate = false;
    const message = chats[i];
    for (let j = 0; j < lastMessagesFiltered.length; j++) {
      const m = lastMessagesFiltered[j];
      // Check if dublicate Private Message
      if (!message.chat_group && !m.chat_group) {
        if (
          (message.sender.id === m.sender.id &&
            message.recipient.id === m.recipient.id) ||
          (message.sender.id === m.recipient.id &&
            message.recipient.id === m.sender.id)
        ) {
          isDublicate = true;
          //Check Date
          if (isDublicate && message.date > m.date) {
            lastMessagesFiltered[j] = message;
          }
        }
      }

      // Check if dublicate Group Message
      if (message.chat_group && m.chat_group) {
        if (message.chat_group.id === m.chat_group.id) {
          isDublicate = true;
          //Check Date
          if (isDublicate && message.date > m.date) {
            lastMessagesFiltered[j] = message;
          }
        }
      }
    }
    if (!isDublicate) {
      lastMessagesFiltered.push(message);
    }
  }

  //Calculate no reads
  lastMessagesFiltered.forEach((message, index) => {
    if (!message.total_no_reads) {
      lastMessagesFiltered[index]["total_no_reads"] = 0;
    }

    const noReads = chats.filter((m) => {
      //Check for private message
      if (
        !message.chat_group &&
        !m.chat_group &&
        m.recipient.id === userId &&
        message.sender.id === m.sender.id &&
        !m.is_read
      ) {
        return true;
      }
      // Check chat groups
      if (message.chat_group && m.chat_group && message.chat_group.id === m.chat_group.id && message.sender.id ===  m.sender.id) {
        if (!m.read_by) {
          return true;
        }
        const readBys = JSON.parse(m.read_by);
        if (readBys && !readBys.includes(userId)) {
          return true;
        }
      }
      return false;
    });

    lastMessagesFiltered[index].total_no_reads = noReads.length;
  });

  return lastMessagesFiltered;
};

export const calculateNonReadPrivateMessages = (arr, userId) => {

  if (arr) {
    let noRead = 0;
    arr.forEach((m) => {
      if (
        !m.chat_group &&
        m.recipient &&
        m.recipient.id === userId &&
        !m.is_read
      ) {
        noRead++;
      }
    });
    return noRead;
  }
};

export const calculateNonReadChatGroupMessages = (arr, userId) => {
  if (arr) {
    let noRead = 0;
    arr.forEach((m) => {
      if (m.chat_group) {
        if (!m.read_by) {
          noRead++;
        }else {
          const readBys = JSON.parse(m.read_by);         
          if (readBys && !readBys.includes(userId)) {
            noRead++;
          }
        }
      }
    });
    return noRead;
  }
};

export const isNoRead = (m, userId) => {
  //Check for private message
  if (!m.chat_group && m.recipient && m.recipient.id === userId && !m.is_read) {
    return true;
  }
  //Check for groups
  if (m.chat_group) {
    const members = JSON.parse(m.chat_group.members);
    if (members && !members.includes(userId)) {
      return true;
    }
  }
  return false;
};

export const isValidUrl = urlString=> {
  try { 
    return Boolean(new URL(urlString)); 
  }
  catch(e){ 
    return false; 
  }
}

export const validateEmail = input => {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return input.match(validRegex);
}




