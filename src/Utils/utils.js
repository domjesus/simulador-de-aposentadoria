import moment from "moment";

function disableFields() {
  let disableElements = document.querySelectorAll(".disable");

  disableElements.forEach((elements) => elements.setAttribute("disabled", true));
}

function LinkConvert(link) {
  if (link.indexOf("http://") >= 0 || link.indexOf("https://") >= 0) return link;

  return `http://${link}`;
}

function isDatasOk(data_ini, data_fim) {
  // console.log("Datas: ", data_ini, data_fim);

  if (!data_ini || !data_fim) return false;

  return moment(data_ini).isSameOrBefore(moment(data_fim));
}

function diffDateInDays(data_ini, data_fim, format = "DD/MM/YYYY") {
  if (!data_ini || !data_fim) return false;

  if (data_ini === data_fim) return 1;

  return moment(data_fim, format).diff(moment(data_ini, format), "days") + 1;
}

function formatDateToBr(date) {
  return moment(date).format("DD/MM/YYYY");
}

function diasParaExtenso(dias_totais) {
  const anos = Math.floor(dias_totais / 365);
  let meses = anos > 0 ? Math.floor((dias_totais - anos * 365) / 30) : Math.floor(dias_totais / 30);
  const dias = dias_totais - anos * 365 - meses * 30;
  // console.log("Ano: ", anos, "meses: ", meses, "dias: ", dias);
  return { anos, meses, dias };
}

export { disableFields, LinkConvert, isDatasOk, diffDateInDays, formatDateToBr, diasParaExtenso };
