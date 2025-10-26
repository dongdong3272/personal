import "./PDFViewer.css";

interface PDFViewerProps {
  filePath: string;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath, title }) => {
  // Use browser's built-in PDF viewer
  const embedUrl = filePath;

  return (
    <div className="pdf-viewer">
      <iframe
        src={embedUrl}
        width="100%"
        height="800px"
        frameBorder="0"
        title={title}
        className="pdf-iframe"
      />

      <div className="pdf-viewer-fallback">
        <p>
          Can't view the PDF?
          <a
            href={filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="download-link"
          >
            Open in new tab
          </a>{" "}
          or
          <a href={filePath} download className="download-link">
            download it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default PDFViewer;
