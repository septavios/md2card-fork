import React, { JSX, useState } from 'react';
import { marked } from 'marked';
import { FinalConfig, CardProps } from '../config/themeConfig';
import { LayoutMode } from '../stores/settingsStore';
import {
  isTextNodeLike,
  isList,
  isTable,
  isImage,
  createNewPage,
  addPageElement,
  handleTextNode,
  handleListNode,
  handleTableNode,
  handleImageNode,
  handleGenericNode
} from './paginatorUtils';

interface PaginatedMarkdownViewerProps {
  html: string;
  pageHeight?: number;
  pageWidth?: number;
  CardComponent: React.FC<CardProps>;
  showPageNumbers?: boolean;
  layoutMode?: LayoutMode;
  config: FinalConfig;
}

const PaginatedMarkdownViewer: React.FC<PaginatedMarkdownViewerProps> = ({
  html,
  pageHeight = 500,
  pageWidth = 300,
  CardComponent,
  showPageNumbers = false,
  layoutMode = "自动拆分",
  config,
}) => {
  const [pages, setPages] = useState<JSX.Element[]>([]);

  const paginate = (sourceEl: HTMLElement) => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.visibility = 'hidden';
    wrapper.style.width = `${pageWidth}px`;
    document.body.appendChild(wrapper);

    const pageElements: JSX.Element[] = [];
    
    // 检查是否有卡片分段
    const cardSections = sourceEl.querySelectorAll('.card-section');
    
    if (cardSections.length > 0) {
      // 处理多个卡片分段
      cardSections.forEach((section, sectionIndex) => {
        let currentPage = createNewPage(wrapper, pageHeight, pageWidth);
        const nodes = Array.from(section.childNodes);
        let i = 0;

        // 为每个分段计算总页数
        const tempWrapper = document.createElement('div');
        tempWrapper.style.position = 'absolute';
        tempWrapper.style.visibility = 'hidden';
        tempWrapper.style.width = `${pageWidth}px`;
        document.body.appendChild(tempWrapper);

        let tempCurrentPage = createNewPage(tempWrapper, pageHeight, pageWidth);
        let tempPageCount = 1;
        let tempI = 0;

        while (tempI < nodes.length) {
          const node = nodes[tempI];
          const clone = node.cloneNode(true) as HTMLElement;
          tempCurrentPage.appendChild(clone);

          if (tempCurrentPage.scrollHeight > pageHeight) {
            tempCurrentPage.removeChild(clone);
            tempPageCount++;
            tempCurrentPage = createNewPage(tempWrapper, pageHeight, pageWidth);
            tempCurrentPage.appendChild(clone);
          }
          tempI++;
        }

        document.body.removeChild(tempWrapper);
        const sectionTotalPages = tempPageCount;

        // 实际分页处理 - 每个分段独立计算页码
        let sectionPageNumber = 1;
        while (i < nodes.length) {
          const node = nodes[i];
          const clone = node.cloneNode(true) as HTMLElement;
          currentPage.appendChild(clone);

          if (currentPage.scrollHeight > pageHeight) {
            currentPage.removeChild(clone);

            if (isTextNodeLike(node)) {
              // 为分段页面传递正确的页码信息
              const { newPage, nodeToAdd } = handleTextNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, sectionTotalPages, config.layout.hideOverflow, sectionPageNumber);
              currentPage = newPage;
              currentPage.appendChild(nodeToAdd);
              sectionPageNumber++;
              i++;
              continue;
            }

            if (isList(node)) {
              const { newPage, nodeToAdd } = handleListNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, sectionTotalPages, config.layout.hideOverflow, sectionPageNumber);
              currentPage = newPage;
              currentPage.appendChild(nodeToAdd);
              sectionPageNumber++;
              i++;
              continue;
            }

            if (isTable(node)) {
              const { newPage, nodeToAdd } = handleTableNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, sectionTotalPages, config.layout.hideOverflow, sectionPageNumber);
              currentPage = newPage;
              currentPage.appendChild(nodeToAdd);
              sectionPageNumber++;
              i++;
              continue;
            }

            if (isImage(node)) {
              const { newPage, nodeToAdd } = handleImageNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, sectionTotalPages, config.layout.hideOverflow, sectionPageNumber);
              currentPage = newPage;
              currentPage.appendChild(nodeToAdd);
              sectionPageNumber++;
              i++;
              continue;
            }

            const { newPage, nodeToAdd } = handleGenericNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, sectionTotalPages, config.layout.hideOverflow, sectionPageNumber);
            currentPage = newPage;
            currentPage.appendChild(nodeToAdd);
            sectionPageNumber++;
          }
          i++;
        }

        if (currentPage.childNodes.length > 0) {
          addPageElement(currentPage, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, sectionTotalPages, config.layout.hideOverflow, sectionPageNumber);
        }
      });
    } else {
      // 原有的单卡片处理逻辑
      let currentPage = createNewPage(wrapper, pageHeight, pageWidth);
      const nodes = Array.from(sourceEl.childNodes);
      let i = 0;

      // 第一次遍历：计算总页数
      const tempWrapper = document.createElement('div');
      tempWrapper.style.position = 'absolute';
      tempWrapper.style.visibility = 'hidden';
      tempWrapper.style.width = `${pageWidth}px`;
      document.body.appendChild(tempWrapper);

      let tempCurrentPage = createNewPage(tempWrapper, pageHeight, pageWidth);
      let tempPageCount = 1;
      let tempI = 0;

      while (tempI < nodes.length) {
        const node = nodes[tempI];
        const clone = node.cloneNode(true) as HTMLElement;
        tempCurrentPage.appendChild(clone);

        if (tempCurrentPage.scrollHeight > pageHeight) {
          tempCurrentPage.removeChild(clone);
          tempPageCount++;
          tempCurrentPage = createNewPage(tempWrapper, pageHeight, pageWidth);
          tempCurrentPage.appendChild(clone);
        }
        tempI++;
      }

      document.body.removeChild(tempWrapper);
      const totalPages = tempPageCount;

      // 第二次遍历：实际分页并传递页码信息
      let pageNumber = 1;
      while (i < nodes.length) {
        const node = nodes[i];
        const clone = node.cloneNode(true) as HTMLElement;
        currentPage.appendChild(clone);

        if (currentPage.scrollHeight > pageHeight) {
          currentPage.removeChild(clone);

          if (isTextNodeLike(node)) {
            const { newPage, nodeToAdd } = handleTextNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, totalPages, config.layout.hideOverflow, pageNumber);
            currentPage = newPage;
            currentPage.appendChild(nodeToAdd);
            pageNumber++;
            i++;
            continue;
          }

          if (isList(node)) {
            const { newPage, nodeToAdd } = handleListNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, totalPages, config.layout.hideOverflow, pageNumber);
            currentPage = newPage;
            currentPage.appendChild(nodeToAdd);
            pageNumber++;
            i++;
            continue;
          }

          if (isTable(node)) {
            const { newPage, nodeToAdd } = handleTableNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, totalPages, config.layout.hideOverflow, pageNumber);
            currentPage = newPage;
            currentPage.appendChild(nodeToAdd);
            pageNumber++;
            i++;
            continue;
          }

          if (isImage(node)) {
            const { newPage, nodeToAdd } = handleImageNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, totalPages, config.layout.hideOverflow, pageNumber);
            currentPage = newPage;
            currentPage.appendChild(nodeToAdd);
            pageNumber++;
            i++;
            continue;
          }

          const { newPage, nodeToAdd } = handleGenericNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, totalPages, config.layout.hideOverflow, pageNumber);
          currentPage = newPage;
          currentPage.appendChild(nodeToAdd);
          pageNumber++;
        }
        i++;
      }

      if (currentPage.childNodes.length > 0) {
        addPageElement(currentPage, pageElements, CardComponent, pageHeight, pageWidth, config, showPageNumbers, totalPages, config.layout.hideOverflow, pageNumber);
      }
    }

    document.body.removeChild(wrapper);
    return pageElements;
  };

  const renderMarkdown =  () => {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // 强制重排以确保正确计算高度
    setTimeout(() => {
      const pages = paginate(temp);
      setPages(pages);
    }, 0);
  };

  React.useEffect(() => {
    if (html) {
      renderMarkdown();
    }
  }, [html,CardComponent,pageHeight,pageWidth]);

  return (
    <div className="pages-wrapper">
      {pages}
    </div>
  );
};

export default PaginatedMarkdownViewer;