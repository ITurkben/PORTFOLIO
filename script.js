let eventHub = new Vue({
  data: {
    cachedWindow: null } });



let Welcome = {
  template: '#welcome-template' };


let Home = {
  template: '#home-template' };


let Writing = {
  template: '#writing-template' };


let Calendar = {
  template: '#calendar-template',
  mounted: function () {
    new Countdown({
      selector: '#timeLeft',
      dateEnd: new Date('Nov 3, 2020 18:00:00'),
      msgPattern: '{days} days, {hours} hours, {minutes} minutes, {seconds} seconds!' });

  } };


const triggerMouseEvent = (node, eventType) => {
  let clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

const SITE_CONTENT = [{
  content: 'Im the welcome window',
  title: 'À propos',
  id: 'welcome',
  isShowing: true,
  comp: Welcome },
{
  content: 'Im the home window',
  title: 'Compétences',
  id: 'home',
  isShowing: false,
  comp: Home },
{
  content: 'Im the writing window',
  title: 'Parcours',
  id: 'writing',
  isShowing: false,
  comp: Writing },
{
  content: 'Im the calendar window',
  title: 'Calendar',
  id: 'calendar',
  isShowing: false,
  comp: Calendar }];


Vue.component('draggable-window', {
  template: '#draggable-window',
  props: ['id', 'title', 'content'],
  data: {
    draggable: null },

  methods: {
    closeWindow: function () {
      eventHub.$emit('close-window', this.$el);
    } },

  mounted: function () {
    let id = `#${this.$el.id}`;
    let title = this.title;
    let x = 0,
    y = 0;

    if (eventHub.cachedWindow && document.getElementById(eventHub.cachedWindow)) {
      let windowEl = document.getElementById(eventHub.cachedWindow);
      x = windowEl.getBoundingClientRect().left + 15;
      y = windowEl.getBoundingClientRect().top + 15;
    }

    TweenLite.set(id, {
      x: x,
      y: y });


    this.draggable = Draggable.create(id, {
      type: "x,y",
      edgeResistance: 0.65,
      bounds: ".restrictor",
      onPress: function () {
        eventHub.$emit('window-focused', title);
      } });


    // LOL, "press"
    triggerMouseEvent(this.$el, 'mousedown');
    triggerMouseEvent(this.$el, 'mouseup');

    eventHub.cachedWindow = this.$el.id;
  } });


new Vue({
  el: '#desktop',
  data: {
    windows: SITE_CONTENT,
    activeWindowTitle: 'trollOS' },

  created: function () {
    eventHub.$on('close-window', this.closeWindow);
    eventHub.$on('window-focused', this.focusWindow);
  },
  methods: {
    closeWindow: function (element) {
      let match = _.find(this.windows, {
        id: element.id });

      match.isShowing = false;

      let closedWindowCount = _.
      chain(this.windows).
      filter({
        isShowing: false }).

      size().
      value();

      if (closedWindowCount === SITE_CONTENT.length) {
        this.focusWindow('Ibrahim');
      }
    },
    focusWindow: function (title) {
      this.activeWindowTitle = title;
    },
    openWindow: function (category) {
      let match = _.find(this.windows, {
        id: category });

      if (match.isShowing) {
        let el = document.getElementById(match.id);
        triggerMouseEvent(el, 'mousedown');
        triggerMouseEvent(el, 'mouseup');
      } else {
        match.isShowing = true;
      }
    } } });
