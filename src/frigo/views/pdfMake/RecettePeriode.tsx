import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import dayjs from 'dayjs';
import Mouvement from 'src/frigo/logic/models/Mouvement';
import Facture from 'src/frigo/logic/models/Facture';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const formatDate = (dateString: string) => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

export const generatePdfRecettePeriode = (data: Facture[], fileName: string, dd: string, df: string) => {
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;

  // Calcul des totaux pour le récapitulatif
  const totalFactures = data.length;
  const totalFactureReal = data.reduce((sum, row) => sum + Number(row.totalfacture), 0);
  const totalBenefice = data.reduce((sum, row) => sum + Number(row.totalfacture) - Number(row.margeBene), 0);

  const formatWithThousandsSeparator = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Utilisation de l'expression régulière pour insérer les espaces tous les 3 chiffres
  };

  // Créer le tableau principal
  const tableBody = [
    [
      { text: 'N°', style: 'tableHeader' },
      { text: 'CODE', style: 'tableHeader' },
      { text: 'DATE FACTURE', style: 'tableHeader' },
      { text: 'CLIENT', style: 'tableHeader' },
      { text: 'NB PRODUIT', style: 'tableHeader' },
      { text: 'MTT FACT REEL', style: 'tableHeader' },
      { text: 'STATUT', style: 'tableHeader' },
      { text: 'TOTAL PDT ACHT', style: 'tableHeader' },
      { text: 'BENEFICE', style: 'tableHeader' }
    ],
    ...data.map(row => [
      row.id,
      { text: row.code, alignment: 'center' },
      { text: row.createdAt.slice(0, -5).replace(/T/g, " "), alignment: 'center' },
      { text: row.client, alignment: 'center' },
      { text: row.nbproduit, alignment: 'center' },
      { text: row.totalfacture, alignment: 'center' },
      { text: row.statut, alignment: 'center' },
      { text: row.margeBene, alignment: 'center' },
      { text: Number(row.totalfacture) - Number(row.margeBene), alignment: 'center' },
    ])
  ];

  // Créer le tableau récapitulatif des totaux
  const recapTableBody = [
    [
      { text: 'Nombre de Factures', style: 'tableHeader' },
      { text: 'Total MTT FACT REEL', style: 'tableHeader' },
      { text: 'Total Bénéfice', style: 'tableHeader' }
    ],
    [
      { text: formatWithThousandsSeparator(totalFactures), alignment: 'center' },
      { text: formatWithThousandsSeparator(totalFactureReal), alignment: 'center' },
      { text: formatWithThousandsSeparator(totalBenefice), alignment: 'center' }
    ]
  ];

  const documentDefinition: any = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: `Situation - Liste des ventes du ${dd} au ${df}`,
      alignment: 'center',
      margin: [0, 20, 0, 20],
      fontSize: 15,
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => {
      return {
        text: `Page ${currentPage} sur ${pageCount}`,
        alignment: 'center',
        margin: [0, 20, 0, 20]
      };
    },
    content: [
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', '*', '*','*', '*', 'auto'],
          body: tableBody
        },
        layout: {
          fillColor: function (rowIndex: number) {
            return rowIndex % 2 === 0 ? '#F3F3F3' : null;
          },
          hLineWidth: (i: number, node: any) => (i === 0 ? 1 : 0.5), // Bords des lignes horizontales
          vLineWidth: (i: number, node: any) => (i === 0 ? 1 : 0.5), // Bords des lignes verticales
          hLineColor: '#B7B7B7',
          vLineColor: '#B7B7B7',
        }
      },
      // Ajout du tableau récapitulatif des totaux
      {
        text: 'Récapitulatif des totaux',
        style: 'subheader',
        alignment: 'center',
        margin: [0, 30, 0, 10]
      },
      {
        table: {
          headerRows: 1,
          widths: ['40%', '30%', '30%'],  // Ajustement de la largeur pour le récapitulatif
          body: recapTableBody
        },
        layout: {
          fillColor: function (rowIndex: number) {
            return rowIndex % 2 === 0 ? '#F3F3F3' : null;
          },
          hLineWidth: (i: number, node: any) => (i === 0 ? 1 : 0.5), // Bords des lignes horizontales
          vLineWidth: (i: number, node: any) => (i === 0 ? 1 : 0.5), // Bords des lignes verticales
          hLineColor: '#B7B7B7',
          vLineColor: '#B7B7B7',
        }
      }
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'black',
        fillColor: '#A7B4F5',
        alignment: 'center',
        margin: [0, 10]
      },
      tableCell: {
        margin: [0, 2, 0, 2]
      },
      subheader: {
        fontSize: 12,
        bold: true
      }
    }
  };

  pdfMake.createPdf(documentDefinition).download(`${fileName}-${formattedDate}-${formattedTime}.pdf`);
};