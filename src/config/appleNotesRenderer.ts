import { Renderer, Tokens } from 'marked';
import { devLog } from '../utils/logger';

export function createAppleNotesRenderer(): Renderer {
  devLog.log('Creating Apple Notes renderer...');
  const renderer = new Renderer();

  // 重写listitem方法来添加data-task属性
  renderer.listitem = function(item: Tokens.ListItem) {
    devLog.log('Apple Notes renderer listitem called:', item);
    
    if (item.task) {
      const dataTask = item.checked ? 'true' : 'false';
      devLog.log(`Task item detected, data-task="${dataTask}"`);
      return `<li data-task="${dataTask}">${item.text}</li>`;
    } else {
      return `<li>${item.text}</li>`;
    }
  };

  // 保留checkbox元素，让CSS处理样式
  renderer.checkbox = function({ checked }: Tokens.Checkbox) {
    devLog.log('Apple Notes renderer checkbox called, checked:', checked);
    return `<input type="checkbox" ${checked ? 'checked' : ''} disabled />`;
  };

  devLog.log('Apple Notes renderer created successfully');
  return renderer;
}