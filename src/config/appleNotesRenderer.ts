import { Renderer, Tokens } from 'marked';

export function createAppleNotesRenderer(): Renderer {
  console.log('Creating Apple Notes renderer...');
  const renderer = new Renderer();

  // 重写listitem方法来添加data-task属性
  renderer.listitem = function(item: Tokens.ListItem) {
    console.log('Apple Notes renderer listitem called:', item);
    
    if (item.task) {
      const dataTask = item.checked ? 'true' : 'false';
      console.log(`Task item detected, data-task="${dataTask}"`);
      return `<li data-task="${dataTask}">${item.text}</li>`;
    } else {
      return `<li>${item.text}</li>`;
    }
  };

  // 保留checkbox元素，让CSS处理样式
  renderer.checkbox = function({ checked }: Tokens.Checkbox) {
    console.log('Apple Notes renderer checkbox called, checked:', checked);
    return `<input type="checkbox" ${checked ? 'checked' : ''} disabled />`;
  };

  console.log('Apple Notes renderer created successfully');
  return renderer;
}