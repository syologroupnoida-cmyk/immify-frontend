import MainApi from '@/util/MainApi';

export const LEAD_FILE_UPLOAD_ENDPOINT = '/uploads/file';
export const LEAD_DOCUMENT_PURPOSE = 'lead-document';

export const leadDocumentTypeOptions = [
  'Resume',
  'Passport',
  'Language Test Certificate',
  'Educational Certificate',
  'Experience Letter',
  'Bank Statement',
  'Other Document',
];

function getUploadUrl(responseData) {
  const data = responseData?.data ?? responseData ?? {};
  return (
    data?.url ||
    data?.fileUrl ||
    data?.file_url ||
    data?.location ||
    data?.path ||
    data?.data?.url ||
    data?.data?.fileUrl ||
    data?.data?.file_url ||
    data?.data?.location ||
    data?.data?.path ||
    ''
  );
}

export function getUploadDocumentName(name, fallbackName = 'Lead Document') {
  return String(name || fallbackName)
    .trim()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^A-Za-z0-9_-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'Lead_Document';
}

export async function uploadLeadDocument(file, name) {
  if (!file) return '';

  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('purpose', LEAD_DOCUMENT_PURPOSE);
  uploadData.append('name', getUploadDocumentName(name, file.name));

  const response = await MainApi.post(LEAD_FILE_UPLOAD_ENDPOINT, uploadData, {
    skipAuth: true,
    suppressAuthRedirect: true,
  });

  return getUploadUrl(response?.data);
}

export function getLeadDocumentPayload(name, url) {
  if (!url) return {};

  const documentName = name || 'Lead Document';
  const baseDocument = { name: documentName, url };

  switch (documentName) {
    case 'Resume':
      return { resumeUrl: url, documents: [baseDocument] };
    case 'Passport':
      return { passportDocumentUrl: url, documents: [baseDocument] };
    case 'Language Test Certificate':
      return { ieltsDocumentUrl: url, documents: [baseDocument] };
    case 'Educational Certificate':
      return { educationalCertificateUrls: [url], documents: [baseDocument] };
    case 'Experience Letter':
      return { experienceLetterUrls: [url], documents: [baseDocument] };
    case 'Bank Statement':
      return { bankStatementUrl: url, documents: [baseDocument] };
    default:
      return { documents: [baseDocument], documentUrls: [url] };
  }
}
