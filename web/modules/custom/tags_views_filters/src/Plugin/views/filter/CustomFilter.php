<?php

namespace Drupal\tags_views_filters\Plugin\views\filter;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\filter\FilterPluginBase;

/**
 * Past/Present/Future event filter.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("myevent_filter")
 */
class CustomFilter extends FilterPluginBase {

  /**
   * Operators.
   *
   * This may not be needed, as we don't have more than one operator. But it
   * is a pattern seen in other filters, 'opStateIs' would be a method that
   * a parent class calls during the query() method.
   */
  public function operators() {
    $operators = [
      'is' => [
        'title' => $this->t('The event is'),
        'method' => 'opStateIs',
        'short' => $this->t('Is'),
        'values' => 1,
      ],
    ];
  }

  /**
   * The form that is show (including the exposed form).
   */
  protected function valueForm(&$form, FormStateInterface $form_state) {
    $form['value'] = [
      '#tree' => TRUE,
      'state' => [
        '#type' => 'select',
        '#title' => $this->t('Event status'),
        '#options' => [
          'all' => $this->t('All'),
          'current' => $this->t('Current'),
          'past' => $this->t('Past'),
          'future' => $this->t('Future'),
        ],
        '#default_value' => !empty($this->value['state']) ? $this->value['state'] : 'all',
      ]
    ];
  }

  /**
   * Applying query filter. If you turn on views query debugging you should see
   * these clauses applied. If the filter is optional, and nothing is selected, this
   * code will never be called.
   */
  public function query() {
    $this->ensureMyTable();
    $start_field_name = "$this->tableAlias.$this->realField";
    $end_field_name = substr($start_field_name, 0, -6) . '_end_value';

    // Prepare sql clauses for each field.
    $date_start = $this->query->getDateFormat($this->query->getDateField($start_field_name, TRUE), 'Y-m-d H:i:s', FALSE);
    $date_end = $this->query->getDateFormat($this->query->getDateField($end_field_name, TRUE), 'Y-m-d H:i:s', FALSE);
    $date_now = $this->query->getDateFormat('FROM_UNIXTIME(***CURRENT_TIME***)', 'Y-m-d H:i:s', FALSE);

    switch ($this->value['state']) {
      case 'current':
        $this->query->addWhereExpression($this->options['group'], "$date_now BETWEEN $date_start AND $date_end");
        break;

      case 'past':
        $this->query->addWhereExpression($this->options['group'], "$date_now > $date_end");
        break;

      case 'future':
        $this->query->addWhereExpression($this->options['group'], "$date_now < $date_start");
        break;
    }
  }

  /**
   * Admin summary makes it nice for editors.
   */
  public function adminSummary() {

    if ($this->isAGroup()) {
      return $this->t('grouped');
    }
    if (!empty($this->options['exposed'])) {
      return $this->t('exposed') . ', ' . $this->t('default state') . ': ' . $this->value['state'];
    }
    else {
      return $this->t('state') . ': ' . $this->value['state'];
    }
  }

}