import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
    // private plugin: any = {
    beforeDraw(chart:any) {
        const ctx:any = chart.ctx;

        //Get options from the center object in options
        const sidePadding = 60;
        const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        const stringWidth = ctx.measureText(chart.options.centerText).width;
        const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        const widthRatio = elementWidth / stringWidth;
        const newFontSize = Math.floor(30 * widthRatio);
        const elementHeight = (chart.innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        const fontSizeToUse = Math.min(newFontSize, elementHeight);

        ctx.font = fontSizeToUse + 'px Arial';
        let riskCheckTemp=chart.options.centerText.trim();
        if(riskCheckTemp <= '40'){
        ctx.fillStyle = 'red';
        }else if(riskCheckTemp > '40' && riskCheckTemp < '70'){
        ctx.fillStyle = 'yellow';
        }else if(riskCheckTemp > '70'){
        ctx.fillStyle = 'green';
        }
        // Draw text in center
        ctx.fillText(chart.options.centerText, centerX, centerY);
    }
  getPlugunFunction(){
    return this.beforeDraw;
  }
}
