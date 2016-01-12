'use strict';

var $ = require('jquery'),
    _ = require('underscore'),
    constants = require('./constants'),
    eventDispatcher = require('../eventDispatcher'),
    events = require('./events');


var display = {

    el: {
        displayContainer: $('<div id="testContainer"/>'),
        resultsContainer: $('<div id="testResults"/>'),
        consoleContainer: $('<div id="testConsole"/>'),
    },

    templates: {
        compiled: {}, // cache compiled templates
        assertionStatus: '<div class="testAssertion <%= statusClass %>"><strong><%= testClass %>::<%= testMethod %>:</strong> <%= message %></div>',
        finalStatus: '<%= testCount %> tests, <%= assertCount %> assertions',
        finalStatusContainer: '<div class="status <%= className %>"><%= status %></div>'
    },

    getTemplate: function(templateName) {
        var template;

        if (typeof this.templates.compiled[templateName] !== 'undefined') {
            // look for cached compiled template
            template = this.templates.compiled[templateName];
        } else if (typeof this.templates[templateName] !== 'undefined') {
            template = _.template(this.templates[templateName]);
            // cache compiled template
            this.templates.compiled[templateName] = template;
        } else {
            console.log('no template found');
        }

        return template;
    },

    init: function() {
        this.createElements();
        this.bindEvents();
    },

    bindEvents: function() {
        eventDispatcher.subscribe(events.ASSERTION_COMPLETE_EVENT, this.displayAssertion);
        eventDispatcher.subscribe(events.ASSERTION_COMPLETE_EVENT, this.updateConsole);
        eventDispatcher.subscribe(events.ALL_TESTS_COMPILED_EVENT, this.displayFinalStatus);
    },

    /**
     * Creates the required display elements and adds them to the DOM
     */
    createElements: function() {
        this.el.displayContainer
            .append(this.el.consoleContainer)
            .append(this.el.resultsContainer)
            ;

        $(document.body).append(this.el.displayContainer);
    },

    displayAssertion: function(report) {
        var assertionStatus = display.getTemplate('assertionStatus')({
            testClass: report.testClass,
            testMethod: report.testMethod,
            message: report.message,
            statusClass: report.status
        });

        if (report.status === constants.PASS) {
            display.el.resultsContainer.append(assertionStatus);
        } else {
            display.el.resultsContainer.prepend(assertionStatus);
        }
    },

    updateConsole: function(report) {
        var text = display.el.consoleContainer.text(),
            pass = (report.status === 'pass'),
            status = pass ? '•' : 'F';

        if (!pass && report.status === 'error') {
            status = 'E';
        }
       
        display.el.consoleContainer.text(text + status);
    },

    displayFinalStatus: function(testResults) {
        var status = display.getTemplate('finalStatus')({
            testCount: testResults.testCount.toString(),
            assertCount: testResults.assertCount.toString()
            }),
            finalStatusTemplate = display.getTemplate('finalStatusContainer');

        if (testResults.fails.length > 0) {
            status += ', ' + testResults.fails.length + ' failures';
        }
        if (testResults.errors.length > 0) {
            status += ', ' + testResults.errors.length + ' errors';
        }

        display.el.resultsContainer.prepend(finalStatusTemplate({
            className: (testResults.fails.length === 0 && testResults.errors.length === 0) ? 'pass' : 'fail',
            status: status
        }));

        document.title += ' | ' + status;
    }
};

module.exports = display;