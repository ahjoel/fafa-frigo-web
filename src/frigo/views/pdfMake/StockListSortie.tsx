import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import dayjs from 'dayjs';
import Mouvement from 'src/frigo/logic/models/Mouvement';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const formatDate = (dateString: string) => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

export const generatePdfStockSortie = (data: Mouvement[], fileName: string, dd: string, df: string) => {
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;

  // Calcul des totaux par produit
  const productTotals = data.reduce((totals: Record<string, number>, row: Mouvement) => {
    const productKey = row.produit + ' ' + row.mesure + ' ' + row.categorie;
    if (totals[productKey]) {
      totals[productKey] += row.qte;
    } else {
      totals[productKey] = row.qte;
    }
    return totals;
  }, {});

  // Créer le tableau principal
  const tableBody = [
    [
      { text: 'N°', style: 'tableHeader' },
      { text: 'CODE FACTURE', style: 'tableHeader' },
      { text: 'DATE FACTURE', style: 'tableHeader' },
      { text: 'PRODUIT', style: 'tableHeader' },
      { text: 'QUANTITE', style: 'tableHeader' },
      { text: 'PRIX DE VENTE', style: 'tableHeader' },
      { text: 'AUTEUR', style: 'tableHeader' }
    ],
    ...data.map(row => [
      row.id,
      { text: row.code, alignment: 'center' },
      { text: row.createdAt.slice(0, -5).replace(/T/g, " "), alignment: 'center' },
      row.produit + ' ' + row.mesure + ' ' + row.categorie,
      { text: row.qte, alignment: 'center' },
      { text: row.pv, alignment: 'center' },
      { text: row.name, alignment: 'center' }
    ])
  ];

  // Créer le tableau récapitulatif des totaux par produit
  const recapTableBody = [
    [
      { text: 'PRODUIT', style: 'tableHeader' },
      { text: 'TOTAL QUANTITE', style: 'tableHeader' }
    ],
    ...Object.entries(productTotals).map(([product, totalQty]) => [
      product,
      { text: totalQty.toString(), alignment: 'center' }
    ])
  ];

  const documentDefinition: any = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: `Situation - Liste des produits sorties du stock du ${dd} au ${df}`,
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
          widths: ['auto', 'auto', 'auto', 'auto', '*', '*', 'auto'],
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
      // Ajout du tableau récapitulatif en bas
      {
        text: 'Récapitulatif des quantités par produits',
        style: 'subheader',
        alignment: 'center',
        margin: [0, 30, 0, 10]
      },
      {
        table: {
          headerRows: 1,
          widths: ['60%', '40%'],  // Réduire la largeur du tableau récapitulatif
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
